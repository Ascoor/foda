<!--sidebar end-->
<!--main content start-->
<section id="main-content">
    <section class="wrapper site-min-height">
        <!-- page start-->
        <section class="panel">
            <header class="panel-heading">
                <i class="fa fa-user"></i> Volunteer   
            </header>
            <div class="panel-body">
                <div class="adv-table editable-table ">
                    <div class="clearfix">
                        <a data-toggle="modal" href="#myModal">
                            <div class="btn-group">
                                <button id="" class="btn green">
                                    <i class="fa fa-plus-circle"></i>  Add Volunteer 
                                </button>
                            </div>
                        </a>
                        <button class="export" onclick="javascript:window.print();">Print</button>  
                    </div>
                    <div class="space15"></div>
                    <table class="table table-striped table-hover table-bordered" id="editable-sample">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Area</th>
                                <th>Email</th>
                                <th>Address</th>
                                <th>Profile</th>
                                <th class="center">Options</th>
                            </tr>
                        </thead>
                        <tbody>

                        <style>

                            .img_url{
                                height:20px;
                                width:20px;
                                background-size: contain; 
                                max-height:20px;
                                border-radius: 100px;
                            }

                        </style>

                        <?php foreach ($volunteers as $volunteer) { ?>
                            <tr class="">
                                <td style="width:8%;"><img style="width:95%;" src="<?php echo $volunteer->img_url; ?>"></td>
                                <td> <?php echo $volunteer->name; ?></td>
                                <td><?php echo $volunteer->phone; ?></td>
                                <td class="center"><?php if(!empty($volunteer->area)){echo $volunteer->area;} ?></td>
                                <td><?php echo $volunteer->email; ?></td>
                                <td class="center" style="width: 2%"><?php echo $volunteer->address; ?></td>
                                <td><?php echo $volunteer->profile; ?></td>
                                <td>
                                    <button id="" data-toggle="modal" class="btn btn-info btn-xs btn_width sms" data-id="<?php echo $volunteer->id; ?>">SMS</button>
                                    <button type="button" style="width: 35px;" class="btn btn-info btn-xs btn_width editbutton" data-toggle="modal" style="width: 50px;" data-id="<?php echo $volunteer->id; ?>"><i class="fa fa-edit"></i></button>  
                                    <a class="btn btn-info btn-xs btn_width delete_button" href="volunteer/delete?id=<?php echo $volunteer->id; ?>" onclick="return confirm('Are you sure you want to delete this item?');"><i class="fa fa-trash-o"></i></a>
                                </td>
                            </tr>
                        <?php } ?>

                        </tbody>
                    </table>
                </div>
            </div>
        </section>
        <!-- page end-->
    </section>
</section>
<!--main content end-->
<!--footer start-->


<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="display: none;">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h4 class="modal-title"><i class="fa fa-plus-circle"></i> Add New Volunteer</h4>
            </div>
            <div class="modal-body">
                <form role="form" action="volunteer/addNew" method="post" enctype="multipart/form-data">
                    <div class="form-group">
                        <label for="exampleInputEmail1">Name</label>
                        <input type="text" class="form-control" name="name" id="exampleInputEmail1" value='' placeholder="">
                    </div>
                    <div class="form-group">
                        <label for="exampleInputEmail1">Email</label>
                        <input type="text" class="form-control" name="email" id="exampleInputEmail1" value='' placeholder="">
                    </div>
                    <div class="form-group">
                        <label for="exampleInputEmail1">Address</label>
                        <input type="text" class="form-control" name="address" id="exampleInputEmail1" value='' placeholder="">
                    </div>
                    <div class="form-group">
                        <label for="exampleInputEmail1">Phone</label>
                        <input type="text" class="form-control" name="phone" id="exampleInputEmail1" value='' placeholder="">
                    </div>
                    <div class="form-group">
                        <label for="exampleInputEmail1">Area</label>
                        <select class="form-control m-bot15" name="area" value=''>
                            <?php foreach ($areas as $area) { ?>
                                <option value="<?php echo $area->name; ?>" <?php
                                if (!empty($volunteer->area)) {
                                    if ($volunteer->area == $area->name) {
                                        echo 'selected';
                                    }
                                }
                                ?> > <?php echo $area->name; ?> </option>
                                    <?php } ?> 
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="exampleInputEmail1">Profile</label>
                        <input type="text" class="form-control" name="profile" id="exampleInputEmail1" value='' placeholder="">
                    </div>
                    <div class="form-group">
                        <label for="exampleInputEmail1">Image</label>
                        <input type="file" name="img_url">
                    </div>

                    <input type="hidden" name="id" value=''>
                    <input type="hidden" name="p_id" value=''>

                    <section class="">
                        <button type="submit" name="submit" class="btn btn-info submit_button">Submit</button>
                    </section>
                </form>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div>


<!-- Edit Volunteer -->
<div class="modal fade" id="myModal2" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="display: none;">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h4 class="modal-title"><i class="fa fa-edit"></i> Edit Volunteer</h4>
            </div>
            <div class="modal-body">
                <form role="form" id="volunteereditForm" action="volunteer/addNew" method="post" enctype="multipart/form-data">
                    <div class="form-group">
                        <label for="exampleInputEmail1">Name</label>
                        <input type="text" class="form-control" name="name" id="exampleInputEmail1" value='' placeholder="">
                    </div>
                    <div class="form-group">
                        <label for="exampleInputEmail1">Email</label>
                        <input type="text" class="form-control" name="email" id="exampleInputEmail1" value='' placeholder="">
                    </div>
                    <div class="form-group">
                        <label for="exampleInputEmail1">Address</label>
                        <input type="text" class="form-control" name="address" id="exampleInputEmail1" value='' placeholder="">
                    </div>
                    <div class="form-group">
                        <label for="exampleInputEmail1">Phone</label>
                        <input type="text" class="form-control" name="phone" id="exampleInputEmail1" value='' placeholder="">
                    </div>
                    <div class="form-group">
                        <label for="exampleInputEmail1">Area</label>
                        <select class="form-control m-bot15" name="area" value=''>
                            <?php foreach ($areas as $area) { ?>
                                <option value="<?php echo $area->name; ?>" <?php
                                if (!empty($volunteer->area)) {
                                    if ($volunteer->area == $area->name) {
                                        echo 'selected';
                                    }
                                }
                                ?> > <?php echo $area->name; ?> </option>
                                    <?php } ?> 
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="exampleInputEmail1">Profile</label>
                        <input type="text" class="form-control" name="profile" id="exampleInputEmail1" value='' placeholder="">
                    </div>
                    <div class="form-group">
                        <label for="exampleInputEmail1">Image</label>
                        <input type="file" name="img_url">
                    </div>
                    <input type="hidden" name="id" value=''>
                    <input type="hidden" name="p_id" value=''>

                    <section class="">
                        <button type="submit" name="submit" class="btn btn-info submit_button">Submit</button>
                    </section>
                </form>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div>


<div class="modal fade" id="myModal4" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="display: none;">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h4 class="modal-title"><i class="fa fa-location-arrow"></i> Send SMS To Volunteer</h4>
            </div>
            <div class="modal-body">
                <form role="form" id="sendSmsToVolunteer" action="sms/sendSmsToSpecificVolunteer" method="post" enctype="multipart/form-data">
                    <div class="form-group">
                        <label for="exampleInputEmail1">Message</label>
                        <textarea cols="50" rows="10" class="form-control" name="message" id="exampleInputEmail1" value=''> </textarea>
                    </div>
                    <input type="hidden" id="area_idd" value="" name="number">
                    <input type="hidden" id="volunteer_namee" value="" name="volunteer_namee">
                    <button type="submit" name="submit" class="btn btn-info submit_button">Submit</button>
                </form>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div>


<!-- Javascript For Edit Client -->
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script type="text/javascript">
                                    $(document).ready(function () {
                                        $(".editbutton").click(function (e) {
                                            e.preventDefault(e);
                                            // Get the record's ID via attribute  
                                            var iid = $(this).attr('data-id');
                                            $('#volunteereditForm').trigger("reset");
                                            $('#myModal2').modal('show');
                                            $.ajax({
                                                url: 'volunteer/editVolunteerByJason?id=' + iid,
                                                method: 'GET',
                                                data: '',
                                                dataType: 'json',
                                            }).success(function (response) {
                                                // Populate the form fields with the data returned from server
                                                $('#volunteereditForm').find('[name="id"]').val(response.volunteer.id).end()
                                                //   $('#volunteereditForm').find('[name="p_id"]').val(response.volunteer.client_id).end()
                                                $('#volunteereditForm').find('[name="name"]').val(response.volunteer.name).end()
                                                $('#volunteereditForm').find('[name="password"]').val(response.volunteer.password).end()
                                                $('#volunteereditForm').find('[name="email"]').val(response.volunteer.email).end()
                                                $('#volunteereditForm').find('[name="address"]').val(response.volunteer.address).end()
                                                $('#volunteereditForm').find('[name="phone"]').val(response.volunteer.phone).end()
                                                $('#volunteereditForm').find('[name="area"]').val(response.volunteer.area).end()
                                                $('#volunteereditForm').find('[name="profile"]').val(response.volunteer.profile).end()
                                            });
                                        });
                                    });
</script>

<script type="text/javascript">
    $(document).ready(function () {
        $(".sms").click(function (e) {
            e.preventDefault(e);
            // Get the record's ID via attribute  
            var iid = $(this).attr('data-id');
            $('#myModal4').modal('show');
            $.ajax({
                url: 'volunteer/editVolunteerByJason?id=' + iid,
                method: 'GET',
                data: '',
                dataType: 'json',
            }).success(function (response) {
                $('#sendSmsToVolunteer').find('[name="number"]').val(response.volunteer.phone).end()
                $('#sendSmsToVolunteer').find('[name="volunteer_namee"]').val(response.volunteer.name).end()
            });

        });
    });

</script>

<script>
    $(document).ready(function () {
        $(".flashmessage").delay(3000).fadeOut(100);
    });
</script>