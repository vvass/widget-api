from flask import Flask, render_template, json, request, send_from_directory

# TEMAPLATES

@app.route('/enter', methods=['GET'])
def get_main():
    return send_from_directory('templates', 'index.html')

@app.route('/widgetView', methods=['GET'])
def widget_view():
    return send_from_directory('templates', 'widget-view.html')