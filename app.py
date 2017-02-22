#!/usr/bin/python

from flask import Flask, render_template, json, request
import MySQLdb
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

@app.route('/todo/api/v1.0/tasks', methods=['GET'])
def get_tasks():
    return jsonify({'tasks': tasks})

@app.route('/createOrder/<cat>/<siz>/<fin>', methods=['POST','GET'])
def get_by_category(cat,siz,fin):

    db=MySQLdb.connect(host="localhost", user="root", passwd="565d7a7ced00c01e37edf4eb6dd05f3f7e607d1f2b49acb2", db="widgets")
    cursor=db.cursor()

    param = dict(_category=cat, _size=siz, _finish=fin)

    query = """INSERT INTO orders (`category`,`size`,`finish`) VALUES ( %(_category)s, %(_size)s, %(_finish)s )"""

    try:

        cursor.execute(query,param)
        db.commit()

        return json.dumps({'success':str('you did it')})


    except Exception as e:
        return json.dumps({'error':str(e)})

    finally:
        cursor.close()
        db.close()

@app.route('/deleteOrder/<order>', methods=['DELETE'])
def delete_order(order):

    db=MySQLdb.connect(host="localhost", user="root", passwd="565d7a7ced00c01e37edf4eb6dd05f3f7e607d1f2b49acb2", db="widgets")
    cursor=db.cursor()

    param = dict(_id=order)

    query = """DELETE FROM `orders` WHERE id=%(_id)s"""

    try:

        cursor.execute(query,param)
        db.commit()

        return json.dumps({'success':str('you deleted it')})


    except Exception as e:
        return json.dumps({'error':str(e)})

    finally:
        cursor.close()
        db.close()

@app.route('/incCount/<orderId>', methods=['POST','GET'])
def inc_order(orderId):

    db=MySQLdb.connect(host="localhost", user="root", passwd="565d7a7ced00c01e37edf4eb6dd05f3f7e607d1f2b49acb2", db="widgets")
    cursor=db.cursor()

    param = dict(_id=orderId)

    query = """update orders, (SELECT count as prevCount FROM orders WHERE id=%(_id)s) as t2 set count=t2.prevCount+1 where id=%(_id)s;"""


    try:

        cursor.execute(query,param)
        db.commit()

        return json.dumps({'success':str('you deleted it')})


    except Exception as e:
        return json.dumps({'error':str(e)})

    finally:
        cursor.close()
        db.close()

@app.route('/getAvalQuantity/<id>', methods=['POST','GET'])
def get_avalable_quantity(id):

    db=MySQLdb.connect(host="localhost", user="root", passwd="565d7a7ced00c01e37edf4eb6dd05f3f7e607d1f2b49acb2", db="widgets")
    cursor=db.cursor()

    param = dict(_id=id)

    query = """SELECT * FROM orders WHERE id=%(_id)s"""

    try:

        cursor.execute(query,param)
        data=cursor.fetchall()

        return json.dumps({'success':str(data)})


    except Exception as e:
        return json.dumps({'error':str(e)})

    finally:
        cursor.close()
        db.close()

# @app.route('/updateAvalQuantity/<id>/<newValue>', methods=['POST','GET'])
# def get_avalable_quantity(id,newValue):
#
#     db=MySQLdb.connect(host="localhost", user="root", passwd="565d7a7ced00c01e37edf4eb6dd05f3f7e607d1f2b49acb2", db="widgets")
#     cursor=db.cursor()
#
#     param = dict(_id=id,_newValue=newValue)
#
#     query = """UPDATE orders SET avalQuantity=%(_newValue)s WHERE id=%(_id)s"""
#
#     try:
#
#         cursor.execute(query,param)
#         db.commit()
#
#         return json.dumps({'success':str('you did it')})
#
#
#     except Exception as e:
#         return json.dumps({'error':str(e)})
#
#     finally:
#         cursor.close()
#         db.close()


if __name__ == '__main__':
  app.run(host='0.0.0.0')
