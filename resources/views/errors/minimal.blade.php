<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Error</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background: #f8fafc;
            color: #1a202c;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            text-align: center;
        }

        .container {
            max-width: 500px;
            padding: 20px;
        }

        .title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .message {
            font-size: 16px;
            color: #4a5568;
        }
    </style>
</head>
<body>
    @php
        $message = $error ?? 'An unexpected error occurred. We are investigating it.';
        $message = strip_tags($message);
    @endphp

    <div class="container">
        <div class="title">Oops!</div>
        <div class="message">{{ $message }}</div>
    </div>
</body>
</html>
