<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Loan Mail</title>
</head>

<body>
    <?php if (!isset($email_text) || !$email_text) $email_text ='We have received your payment on '.$payment_date.'. Your receipt number is '.$receipt_number ;?>
    <h1>Dear <?php echo $borrower_name?$borrower_name:'Student'; ?></h1>
    <p><?php echo $email_text; ?></p>
    <p><a href="https://pucsl.com/mail-receipt/<?php echo $encrypted_q; ?>">View receipt</a></p>
</body>

</html>
