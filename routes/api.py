from flask import Blueprint, request, jsonify, send_file
from flask_login import login_required, current_user
from models import ProblemHistory
from extensions import db
from utils.ai_solver import solve_math_problem, chat_with_math_assistant
from utils.pdf_generator import create_pdf_from_text
import os
import uuid

api_bp = Blueprint('api', __name__, url_prefix='/api')

@api_bp.route('/solve', methods=['POST'])
@login_required
def solve():
    data = request.json
    problem_text = data.get('problem')
    image_base64 = data.get('image_base64') # optional
    
    if not problem_text and not image_base64:
        return jsonify({'error': 'No input provided'}), 400

    # Call AI Solver
    try:
        solution = solve_math_problem(problem_text, image_base64)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    # Save to history
    history = ProblemHistory(
        user_id=current_user.id,
        problem_text=problem_text or 'Image uploaded',
        solution_text=solution
    )
    db.session.add(history)
    db.session.commit()

    return jsonify({
        'solution': solution,
        'history_id': history.id
    })

@api_bp.route('/chat', methods=['POST'])
@login_required
def chat():
    data = request.json
    message = data.get('message')
    context = data.get('context') # past messages or current solution context
    
    if not message:
        return jsonify({'error': 'Message cannot be empty'}), 400
        
    try:
        response = chat_with_math_assistant(message, context)
        return jsonify({'response': response})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api_bp.route('/download/<int:history_id>')
@login_required
def download_pdf(history_id):
    history = ProblemHistory.query.get_or_404(history_id)
    if history.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
        
    pdf_path = create_pdf_from_text(history.problem_text, history.solution_text)
    return send_file(pdf_path, as_attachment=True, download_name=f'solution_{history_id}.pdf', mimetype='application/pdf')
