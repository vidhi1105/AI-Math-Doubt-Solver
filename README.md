#  🤖 AI Math Doubt Solver Web App

An **AI-powered Math Doubt Solver** web application that helps students solve mathematical problems instantly with **step-by-step explanations**.  
It also supports **OCR (image-to-text)**, **graph plotting**, **PDF download**, **scientific calculator**, and **AI chat assistant**.

---

## 🚀 Features

✅ User Authentication (Signup/Login/Logout)  
✅ AI Math Solver (Step-by-step solution + final answer)  
✅ AI Chat Assistant for re-explanation and practice problems  
✅ OCR Image Upload (Extract math question from image)  
✅ Interactive Graph Generator using Plotly.js  
✅ Scientific Calculator (sin, cos, tan, log, sqrt, power)  
✅ Download solution as PDF  
✅ History Tracking (stores last solved questions)  
✅ Premium pastel UI with Tailwind CSS  
✅ Mobile responsive design + smooth animations  

---

## 🛠 Tech Stack

### Backend
- **Flask (Python)**
- **SQLite Database**
- **OpenRouter API (GPT-4o-mini)**

### Frontend
- **HTML**
- **Tailwind CSS**
- **JavaScript**

### Extra Tools
- **Plotly.js** (Graph plotting)
- **pytesseract + Pillow** (OCR)
- **ReportLab** (PDF generation)

---

## 📂 Project Structure

```

ai_math_solver/
│
├── app.py
├── config.py
├── requirements.txt
│
├── routes/
│   ├── auth.py
│   ├── main.py
│   ├── api.py
│
├── utils/
│   ├── ai_solver.py
│   ├── pdf_generator.py
│   ├── ocr.py
│
├── templates/
│   ├── base.html
│   ├── index.html
│   ├── login.html
│   ├── signup.html
│   ├── dashboard.html
│
├── static/
│   ├── css/style.css
│   ├── js/main.js
│   ├── js/calculator.js
│   ├── js/graph.js
│
└── uploads/

````

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/vidhi1105/AI-Math-Doubt-Solver.git
cd AI-Math-Doubt-Solver
````

### 2️⃣ Create virtual environment

```bash
python -m venv venv
```

Activate environment:

**Windows**

```bash
venv\Scripts\activate
```

**Mac/Linux**

```bash
source venv/bin/activate
```

### 3️⃣ Install dependencies

```bash
pip install -r requirements.txt
```

---

## 🔑 Set OpenRouter API Key

Create a `.env` file in the project directory and add:

```
OPENROUTER_API_KEY=your_api_key_here
```

⚠️ Do not upload `.env` to GitHub.

---

## 🖼 OCR Setup (Tesseract Required)

OCR works using **Tesseract OCR**.

### Install Tesseract (Windows)

Download from:
[https://github.com/UB-Mannheim/tesseract/wiki](https://github.com/UB-Mannheim/tesseract/wiki)

After installing, add it to PATH.

If OCR does not work, set the path manually inside `utils/ocr.py`:

```python
pytesseract.pytesseract.tesseract_cmd = r"C:\\Program Files\\Tesseract-OCR\\tesseract.exe"
```

---

## ▶️ Run the Application

```bash
python app.py
```

Open in browser:

```
http://127.0.0.1:5000
```

---

## 📌 Example Inputs

### AI Solver

* Solve: `x^2 - 5x + 6 = 0`
* Differentiate: `y = x^3 + 4x^2`
* Integrate: `∫ (2x + 3) dx`

### Graph Generator

* `x**2`
* `x**3 - 4*x`
* `2*x + 5`

---

## 🔮 Future Improvements

* MathJax for better equation rendering
* Dark mode theme
* Save PDF solutions permanently
* Deployment on Render / Railway / AWS

---

## 👩‍💻 Author

**Vidhi Mandhana**
GitHub: [https://github.com/vidhi1105](https://github.com/vidhi1105)

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!

```

---

If you want, I can also :contentReference[oaicite:0]{index=0}.
```
