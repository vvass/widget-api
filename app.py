#!/usr/bin/python

from flask import Flask, render_template, json, request
import _mysql

app = Flask(__name__)

tasks = [
    {
        'id': 1,
        'title': u'Buy groceries',
        'description': u'Milk, Cheese, Pizza, Fruit, Tylenol',
        'done': False
    },
    {
        'id': 2,
        'title': u'Learn Python',
        'description': u'Need to find a good Python tutorial on the web',
        'done': False
    }
]

db=_mysql.connect(host="localhost", user="root", passwd="3342e8db85744734794d60c9c797bbcf6c24007d84debbf4", db="widgets")




@app.route('/todo/api/v1.0/tasks', methods=['GET'])
def get_tasks():
    return jsonify({'tasks': tasks})

@app.route('/test', methods=['GET'])
def get_order():
    try:
        db.query("""SELECT * FROM orders""")
        results=db.store_result()


    except Exception as e:
        return json.dumps({'error':str(e)})
    finally:
        return db.close()





if __name__ == '__main__':
  app.run(host='0.0.0.0')
