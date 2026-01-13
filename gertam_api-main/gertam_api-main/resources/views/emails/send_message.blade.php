<!DOCTYPE html>
<html>
<head>
    <title>{{ $data['subject'] }}</title>
</head>
<body>
    <p>مرحباً،</p>
    <p>{{ $data['message'] }}</p>
    <p>تم الإرسال من: {{ $data['email'] }}</p>
</body>
</html>
