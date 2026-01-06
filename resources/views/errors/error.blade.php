<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Oops</title>
    <style>
        @import url("https://fonts.googleapis.com/css?family=VT323");

        :root {
            --width: 280px;
            --height: 180px;
        }

        body {
            background: #6BA1CA;
            margin: 0;
            padding: 0;
        }

        .error-500 {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-family: 'VT323', monospace;
            color: #1E4B6D;
            text-shadow: 1px 1px 1px rgba(255, 255, 255, 0.3);
        }

        .error-500::after {
            content: attr(data-text);
            display: block;
            margin-top: calc(var(--height) / 10 + 15px);
            font-size: 28pt;
            text-align: center;
        }

        spaguetti {
            width: var(--width);
            height: var(--height);
            display: block;
            margin: 0 auto;
            position: relative;
            filter: drop-shadow(0 0 0.75rem rgba(0, 0, 0, 0.2));
        }

        plate {
            width: 100%;
            height: calc(var(--height) / 2.5);
            background: #CAD7E4;
            position: absolute;
            bottom: 0;
            border-radius: 0 0 50px 50px;
            z-index: 4;
        }

        plate::before {
            content: '500 Spaghetti Report';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-transform: uppercase;
            font-weight: bold;
            color: rgba(0, 0, 0, 0.2);
            text-align: center;
            font-size: 11px;
        }

        plate::after {
            content: '';
            width: calc(var(--width) / 2);
            height: calc(var(--height) / 10);
            background: #B5C3D0;
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
        }

        pasta {
            width: calc(var(--width) / 4);
            height: calc(var(--width) / 4);
            border: 5px solid #DEA631;
            background: #EED269;
            border-radius: 50%;
            position: absolute;
            bottom: calc(calc(var(--height) / 2.5) / 3);
            right: 10px;
            box-shadow:
                -130px 10px 1px 10px #EED269,
                -130px 10px 0 15px #DEA631;
            z-index: 2;
        }

        pasta::before {
            content: '';
            width: calc(var(--width) / 4);
            height: calc(var(--width) / 4);
            border: 5px solid #DEA631;
            background: #EED269;
            border-radius: 50%;
            position: absolute;
            bottom: -5px;
            right: 60px;
            box-shadow:
                -90px 10px 1px 1px #EED269,
                -90px 10px 0 5px #DEA631;
        }

        pasta::after {
            content: '';
            width: calc(var(--width) / 3);
            height: calc(var(--width) / 4);
            border: 5px solid #DEA631;
            background: #EED269;
            border-radius: 50%;
            position: absolute;
            bottom: -15px;
            right: 100px;
            box-shadow:
                70px 10px 1px 1px #EED269,
                70px 10px 0 5px #DEA631;
        }

        meat {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: #B64C19;
            position: absolute;
            bottom: calc(var(--height) / 2.5);
            right: 64px;
            box-shadow:
                -150px -2px 0 0 #B64C19,
                -50px -7px 0 0 #B64C19,
                -100px 8px 0 0 #B64C19;
            z-index: 3;
        }

        fork {
            width: 20px;
            height: calc(var(--height) - 30px);
            background: #D3D3D3;
            border-right: 3px solid #B7B7B7;
            border-radius: 50px 50px 0 0;
            position: absolute;
            bottom: 25%;
            left: 75%;
            transform: translate(-75%, 0%) rotate(25deg);
        }
    </style>
</head>
<body>
    @php
        $errorMessage = $error ?? 'Oops! Something went wrong. We are checking out the problem!';
        $errorMessage = strip_tags($errorMessage);
    @endphp

    <div class="error-500" data-text="{{ $errorMessage }}">
        <spaguetti>
            <fork></fork>
            <meat></meat>
            <pasta></pasta>
            <plate></plate>
        </spaguetti>
    </div>

    <script>
        const errorDiv = document.querySelector(".error-500");
        const message = errorDiv.getAttribute("data-text") || "Oops! Something went wrong.";
        let i = 0, data = "";

        const typeEffect = setInterval(() => {
            if (i === message.length) {
                clearInterval(typeEffect);
            } else {
                data += message[i];
                errorDiv.setAttribute("data-text", data);
                i++;
            }
        }, 90);
    </script>
</body>
</html>
