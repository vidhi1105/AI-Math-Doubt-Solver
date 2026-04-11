import os
import requests
import json

def get_openrouter_api_key():
    return os.environ.get('OPENROUTER_API_KEY')

def get_headers():
    return {
        "Authorization": f"Bearer {get_openrouter_api_key()}",
        "Content-Type": "application/json"
    }

SYSTEM_PROMPT = "You are a professional math teacher. Solve the problem step by step, explain clearly, and give the final answer separately."

def solve_math_problem(text=None, image_data=None):
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    
    user_content = []
    if text:
        user_content.append({"type": "text", "text": text})
    if image_data:
        # Assuming image_data is a valid base64 URL format: data:image/jpeg;base64,...
        user_content.append({
            "type": "image_url",
            "image_url": {
                "url": image_data
            }
        })
        
    if not user_content:
        raise ValueError("Must provide either text or image")
        
    messages.append({
        "role": "user",
        "content": user_content
    })
    
    payload = {
        "model": "openai/gpt-4o-mini",
        "messages": messages
    }
    
    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers=get_headers(),
        data=json.dumps(payload)
    )
    
    if response.status_code == 200:
        return response.json()['choices'][0]['message']['content']
    else:
        raise Exception(f"API Error: {response.status_code} - {response.text}")

def chat_with_math_assistant(message, context=None):
    messages = [{"role": "system", "content": "You are a friendly and helpful math assistant. Follow up on math problems, explain them simpler if asked, or generate similar problems."}]
    
    if context:
        messages.append({"role": "system", "content": f"Context of current problem: {context}"})
        
    messages.append({"role": "user", "content": message})
    
    payload = {
        "model": "openai/gpt-4o-mini",
        "messages": messages
    }
    
    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers=get_headers(),
        data=json.dumps(payload)
    )
    
    if response.status_code == 200:
        return response.json()['choices'][0]['message']['content']
    else:
        raise Exception(f"API Error: {response.status_code} - {response.text}")
