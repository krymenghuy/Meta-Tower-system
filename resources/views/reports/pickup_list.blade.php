                        <hr class="my-2">
                        <table class="table">
                                <thead>
                                    <tr>
                                        <th class="border-0 text-uppercase small font-weight-bold">Date</th>
                                        <th class="border-0 text-uppercase small font-weight-bold">Order ID</th>
                                        <th class="border-0 text-uppercase small font-weight-bold">Merchant</th>
                                        <th class="border-0 text-uppercase small font-weight-bold">Vehicle Type</th>
                                        <th class="border-0 text-uppercase small font-weight-bold">Qty</th>
                                        <th class="border-0 text-uppercase small font-weight-bold">Driver Name</th>
                                        <th class="border-0 text-uppercase small font-weight-bold">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                       @foreach($items as $c)
                                        <tr>
                                        <td>{{$c->request_date}}</td>
                                        <td>{{$c->order_code}}</td>
                                        <td>{{$c->sender_name}}</td>
                                        <td>{{$c->vehicle_type}}</td>
                                        <td>{{$c->qty}}</td>
                                        <td>{{$c->driver_name}}</td>
                                        <td>{{$c->status}}</td>
                                        </tr>
                                       @endforeach    
                                     
                                </tbody>
                            </table>