import os
import json
from datetime import datetime
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'sayand-portfolio-secret-2026')

PROFILE_DATA = {
    "name": "Sayand",
    "initials": "S",
    "reg_no": "stm23cs043",
    "dob": "March 2026",
    "address": "Kuthuparamba, Kannur, Kerala",
    "favorite_company": "Tesla, IBM",
    "degree": "B.Tech Computer Science & Engineering",
    "semester": "Semester 7",
    "cgpa": "7.75",
    "location": "Kerala, India",
    "email": "sayand.r23@gmail.com",
    "phone": "+91 9995311232",
    "phone_display": "+91 99953 11232",
    "avatar_path": "static/images/profile.jpg",
    "avatar_fallback": "static/images/profile.png",
    "headline": "Crafting software with quiet care and human warmth.",
    "quote": "I am into Blissful software development that can bring brightness into people's lives.",
    "subtext": "A student developer based in Kerala, building gentle mobile experiences and thoughtful software that leaves people feeling calm instead of overwhelmed.",
    "device": "Computer Science & Engineering",
    "skills": {
        "primary": ["Python", "Kotlin", "Dart (Flutter)", "PyTorch"],
        "domains": ["Natural Language Processing", "Edge AI & Optimization", "Transformer Architectures", "Model Quantization"],
        "tools": ["Transformers", "PyTorch", "ONNX Runtime", "Android SDK", "Git"]
    }
}

PROJECTS_DATA = [
    {
        "id": "orbit",
        "title": "The Orbit AI",
        "subtitle": "Collaborative Development Platform Concept",
        "badge": "Platform Concept",
        "category": "platform",
        "highlight": "Brand Identity & Architecture",
        "logo": "static/images/orbit-logo.png",
        "logo_fallback": "static/images/orbit-logo.png",
        "description": "A prototype workspace designed for student teams to brainstorm system architectures, share code snippets in real time, and make engineering decisions together.",
        "tags": ["Python", "WebSockets", "System Design", "Flutter Desktop"],
        "metrics": "Realtime Canvas",
        "has_logo": True,
        "has_screens": False,
        "quote": "Bringing developers into one shared room where ideas and code flow without disjointed communication."
    },
    {
        "id": "vts",
        "title": "Vehicle Tracking System",
        "subtitle": "Android Fleet Location Telemetry",
        "badge": "Android System",
        "category": "mobile",
        "highlight": "GPS & Geofencing",
        "description": "An Android application engineered for fleet location monitoring, battery-conscious background services, and automated geofence boundary alerts.",
        "tags": ["Kotlin", "Location Services", "Google Maps API", "Background Workers"],
        "metrics": "Low-Drain Telemetry",
        "has_logo": False,
        "has_screens": False,
        "quote": "Engineered to track location steadily in the background without draining the phone battery during long drives."
    },
    {
        "id": "security",
        "title": "Digital Security App",
        "subtitle": "Android Threat & Domain Inspection",
        "badge": "Security Tool",
        "category": "mobile",
        "highlight": "DNS & Network Inspection",
        "description": "An Android security utility exploring DNS-level packet inspection to shield users against deceptive phishing links and suspicious web scripts.",
        "tags": ["Kotlin", "Dart", "Android VpnService", "Network Safety"],
        "metrics": "Local Packet Inspection",
        "has_logo": False,
        "has_screens": False,
        "quote": "Built to help everyday users understand what background network connections apps are making."
    }
]

JOURNEY_TIMELINE = [
    {
        "period": "2023 – Present",
        "badge": "Current Degree",
        "title": "B.Tech in Computer Science & Engineering",
        "institution": "Kerala, India",
        "location": "Kerala, India",
        "details": "Semester 7 &bull; CGPA: 7.75",
        "description": "Diving deep into operating systems, computer architecture, mobile engineering, and writing clean, understandable code."
    },
    {
        "period": "Summer 2026",
        "badge": "Open Source",
        "title": "Velune Contributor",
        "institution": "Open Source Community",
        "location": "Remote",
        "details": "Code Refactoring & Optimizations",
        "description": "Contributed performance cleanups, modular refactoring, and code reviews to the open source Velune ecosystem."
    }
]

@app.route('/')
def index():
    return render_template(
        'index.html',
        profile=PROFILE_DATA,
        projects=PROJECTS_DATA,
        timeline=JOURNEY_TIMELINE,
        year=datetime.now().year
    )

@app.route('/student-profile')
@app.route('/assignment')
def student_profile():
    return render_template('student-profile.html', profile=PROFILE_DATA)

@app.route('/api/projects')
def api_projects():
    return jsonify({
        "status": "success",
        "count": len(PROJECTS_DATA),
        "projects": PROJECTS_DATA
    })

@app.route('/api/contact', methods=['POST'])
def api_contact():
    data = request.get_json() or request.form
    name = (data.get('name') or '').strip()
    email = (data.get('email') or '').strip()
    subject = (data.get('subject') or 'Hello Sayand').strip()
    message = (data.get('message') or '').strip()

    if not name or not email or not message:
        return jsonify({
            "status": "error",
            "message": "Please share your name, email, and a message."
        }), 400

    msg_entry = {
        "timestamp": datetime.now().isoformat(),
        "name": name,
        "email": email,
        "subject": subject,
        "message": message
    }

    try:
        messages_file = os.path.join(os.path.dirname(__file__), 'messages.json')
        existing = []
        if os.path.exists(messages_file):
            with open(messages_file, 'r', encoding='utf-8') as f:
                try:
                    existing = json.load(f)
                except Exception:
                    existing = []
        existing.append(msg_entry)
        with open(messages_file, 'w', encoding='utf-8') as f:
            json.dump(existing, f, indent=2)
    except Exception as e:
        print(f"Error saving message: {e}")

    return jsonify({
        "status": "success",
        "message": f"Thank you, {name}! Your note has been received by Sayand."
    })

@app.route('/api/status')
def api_status():
    return jsonify({
        "status": "online",
        "student": "Sayand",
        "reg_no": "stm23cs043",
        "device": "Android Native",
        "semester": "B.Tech CSE Sem 7"
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
