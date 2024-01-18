from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os
from urllib.parse import quote_plus

app = Flask(__name__)

password = quote_plus('Lar1ss0n')

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', f'postgresql://postgres:{password}@localhost:5432/TodoList')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
CORS(app)

class Task(db.Model):
    __tablename__ = 'task'
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(100), nullable=False)
    descripcion = db.Column(db.String(500), nullable=False)

    def __init__(self, titulo, descripcion):
        self.titulo = titulo
        self.descripcion = descripcion

@app.route('/task', methods=['POST'])
def create_task():
    try:
        titulo = request.json['titulo']
        descripcion = request.json['descripcion']
        new_task = Task(titulo, descripcion)
        db.session.add(new_task)
        db.session.commit()
        return jsonify({'message': 'Tarea creada'})
    except Exception as e:
        return jsonify({'error': f'Error creating task: {str(e)}'})

@app.route('/task', methods=['GET'])
def get_tasks():
    tasks = Task.query.all()
    data = []
    for task in tasks:
        data.append({'id': task.id, 'titulo': task.titulo, 'descripcion': task.descripcion})
    return jsonify(data)

@app.route('/task/<id>', methods=['DELETE'])
def delete_task(id):
    try:
        task = Task.query.filter_by(id=id).first()
        db.session.delete(task)
        db.session.commit()
        return jsonify({'message': 'Tarea eliminada'})
    except Exception as e:
        return jsonify({'error': f'Error deleting task: {str(e)}'})

@app.route('/task/<id>', methods=['PUT'])
def update_task(id):
    try:
        task = Task.query.filter_by(id=id).first()
        titulo = request.json['titulo']
        descripcion = request.json['descripcion']
        task.titulo = titulo
        task.descripcion = descripcion
        db.session.commit()
        return jsonify({'message': 'Tarea actualizada'})
    except Exception as e:
        return jsonify({'error': f'Error updating task: {str(e)}'})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()


    app.run(debug=True)

