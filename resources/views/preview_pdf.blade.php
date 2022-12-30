

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
<table class="table">
  <thead>
    <tr>
        <th>Image</th>
      <th scope="col" style="background:lightgray;">QR Code</th>
      <th>កញ្ចប់</th>
    </tr>
  </thead>
  <tbody>
   
      

         @foreach($datas as $data)

         <tr>
             <td><img style="height:50px;" src="img/photo.jpg" alt=""></td>
             <td style="border-bottom: 1px solid lightgrey; padding:5px;">{{ $data->qr_code }}</td>
             <td>កញ្ចប់</td>
            
        </tr>

        @endforeach

      
    
 
  </tbody>
</table>
</body>
</html>

