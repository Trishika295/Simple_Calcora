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
        data = request.get_json(silent=True)

        if not data:
            return jsonify({
                "success": False,
                "error": "No calculation data received."
            }), 400

        num1 = data.get("num1")
        num2 = data.get("num2")
        operation = data.get("operation")

        # Validate numbers
        if num1 is None or num1 == "":
            return jsonify({
                "success": False,
                "error": "Please enter the first number."
            }), 400

        if num2 is None or num2 == "":
            return jsonify({
                "success": False,
                "error": "Please enter the second number."
            }), 400

        # Validate operation
        if not operation:
            return jsonify({
                "success": False,
                "error": "Please select an operation."
            }), 400

        # Convert values to numbers
        try:
            num1 = float(num1)
            num2 = float(num2)
        except (ValueError, TypeError):
            return jsonify({
                "success": False,
                "error": "Please enter valid numbers."
            }), 400

        # Perform calculation
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
                "error": "Invalid operation selected."
            }), 400

        # Remove unnecessary .0 from whole numbers
        if result.is_integer():
            result = int(result)

        return jsonify({
            "success": True,
            "result": result
        })

    except Exception as error:
        print("Server Error:", error)

        return jsonify({
            "success": False,
            "error": "An unexpected server error occurred."
        }), 500


if __name__ == "__main__":
    print("\n======================================")
    print("       Calculator Flask Server")
    print("======================================")
    print("Server running at:")
    print("http://127.0.0.1:5000")
    print("======================================\n")

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )