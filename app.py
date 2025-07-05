import gradio as gr
from agent_flow import run_agent

# Build Gradio interface
with gr.Blocks() as demo:
    with gr.Row():
        with gr.Column(scale=1):
            lead_view = gr.Dataframe(headers=None, label="Stored Leads")
        with gr.Column(scale=2):
            summary_input = gr.Textbox(lines=8, placeholder="Paste meeting summary...", label="Meeting Summary")
            process_btn = gr.Button("Process & Save")
            result_out = gr.JSON(label="Processed Schema")

    def handle(summary):
        # Process the meeting summary and retrieve updated leads
        processed, leads = run_agent(summary)
        return leads, processed

    # Ensure click outputs match handle return values
    process_btn.click(
        fn=handle,
        inputs=[summary_input],
        outputs=[lead_view, result_out]
    )

if __name__ == "__main__":
    demo.launch()