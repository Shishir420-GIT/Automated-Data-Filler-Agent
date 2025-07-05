import gradio as gr
from agent_flow import run_agent

def handle_processing(summary):
    """Handle the processing of meeting summary"""
    if not summary or not summary.strip():
        return [], {"error": "Please provide a meeting summary"}
    
    try:
        # Process the meeting summary and retrieve updated leads
        processed, leads = run_agent(summary.strip())
        
        # Format leads for display in dataframe
        if leads:
            # Convert leads to a more readable format for the dataframe
            formatted_leads = []
            for lead in leads:
                contact = lead.get('contact', {})
                company = lead.get('company', {})
                deal = lead.get('deal', {})
                
                formatted_lead = [
                    contact.get('name', 'N/A'),
                    contact.get('email', 'N/A'),
                    contact.get('phone', 'N/A'),
                    company.get('name', 'N/A'),
                    company.get('industry', 'N/A'),
                    deal.get('value', 'N/A'),
                    deal.get('stage', 'N/A')
                ]
                formatted_leads.append(formatted_lead)
            
            return formatted_leads, processed
        else:
            return [], processed
            
    except Exception as e:
        error_result = {"error": f"Processing failed: {str(e)}"}
        return [], error_result

# Build Gradio interface
with gr.Blocks(title="CRM Lead Processor", theme=gr.themes.Soft()) as demo:
    gr.Markdown("# CRM Lead Processing System")
    gr.Markdown("Process meeting summaries to extract and store lead information automatically.")
    
    with gr.Row():
        with gr.Column(scale=1):
            gr.Markdown("### Stored Leads")
            lead_view = gr.Dataframe(
                headers=["Name", "Email", "Phone", "Company", "Industry", "Deal Value", "Stage"],
                label="Lead Database",
                interactive=False
            )
        
        with gr.Column(scale=2):
            gr.Markdown("### Process New Meeting")
            summary_input = gr.Textbox(
                lines=8, 
                placeholder="Paste your meeting summary here...\n\nExample: 'Had a great call with John Smith from TechCorp. He's the VP of Engineering and they're looking for a CRM solution. Budget is around $50k, timeline is Q2. Main competitor is Salesforce. Next step is to send a proposal.'", 
                label="Meeting Summary"
            )
            
            with gr.Row():
                process_btn = gr.Button("Process & Save Lead", variant="primary")
                clear_btn = gr.Button("Clear", variant="secondary")
            
            gr.Markdown("### Processing Results")
            result_out = gr.JSON(label="Extracted Data")

    # Event handlers
    process_btn.click(
        fn=handle_processing,
        inputs=[summary_input],
        outputs=[lead_view, result_out]
    )
    
    clear_btn.click(
        fn=lambda: ("", [], {}),
        outputs=[summary_input, lead_view, result_out]
    )
    
    # Load existing leads on startup
    demo.load(
        fn=lambda: (run_agent("")[1], {}),  # Get existing leads without processing
        outputs=[lead_view, result_out]
    )

if __name__ == "__main__":
    demo.launch()