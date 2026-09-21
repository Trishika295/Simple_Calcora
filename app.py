from flask import Flask, render_template, request, jsonify

app = Flask(
    __name__,
    template_folder="docs",
    static_folder="static"
)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/calculate", methods=["POST"])
def calculate():
    try:
        data = request.get_json()

        if not data:
            return jsonify({
                "success": False,
                "error": "No data received."
            }), 400

        num1 = data.get("num1")
        num2 = data.get("num2")
        operation = data.get("operation")

        if num1 is None or num2 is None:
            return jsonify({
                "success": False,
                "error": "Please enter both numbers."
            }), 400

        if not operation:
            return jsonify({
                "success": False,
                "error": "Please select an operation."
            }), 400

        try:
            num1 = float(num1)
            num2 = float(num2)
        except (ValueError, TypeError):
            return jsonify({
                "success": False,
                "error": "Please enter valid numbers."
            }), 400

        if operation == "add":
            result = num1 + num2

        elif operation == "subtract":
            result = num1 - num2

        elif operation == "multiply":
            result = num1 * num2

        elif operation == "divide":
            if num2 == 0:
                return jsonify({
                    "success": False,
                    "error": "Cannot divide by zero."
                }), 400

            result = num1 / num2

        elif operation == "modulus":
            if num2 == 0:
                return jsonify({
                    "success": False,
                    "error": "Cannot perform modulus by zero."
                }), 400

            result = num1 % num2

        else:
            return jsonify({
                "success": False,
                "error": "Invalid operation."
            }), 400

        if result.is_integer():
            result = int(result)

        return jsonify({
            "success": True,
            "result": result
        })

    except Exception as e:
        print("Error:", e)

        return jsonify({
            "success": False,
            "error": "An unexpected error occurred."
        }), 500


if __name__ == "__main__":
    app.run(debug=True)