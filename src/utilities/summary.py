from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
from langchain.llms import HuggingFacePipeline
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain

# Load the tokenizer and model once
tokenizer = AutoTokenizer.from_pretrained("Qwen/Qwen1.5-1.8B-Chat", trust_remote_code=True)
model = AutoModelForCausalLM.from_pretrained("Qwen/Qwen1.5-1.8B-Chat", trust_remote_code=True)

# Create generation pipeline
pipe = pipeline(
    "text-generation",
    model=model,
    tokenizer=tokenizer,
    max_new_tokens=512,
    temperature=0.7,
    do_sample=True,
)

# Wrap into LangChain-compatible LLM
llm = HuggingFacePipeline(pipeline=pipe)

# Setup prompt template
prompt = PromptTemplate(
    input_variables=["transcript"],
    template="""
You are an expert meeting assistant. Your job is to summarize the following transcript from a meeting.

Instructions:
1. Highlight key discussion points.
2. Extract any action items.
3. Mention any decisions made.
4. Keep it clear and concise.

Transcript:
{transcript}

Summary:
"""
)

# LangChain summarization chain
chain = LLMChain(llm=llm, prompt=prompt)

# Final function
def generate_summary(transcript: str) -> str:
    return chain.run(transcript=transcript)
