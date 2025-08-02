<!--sidebar end-->
<!--main content start-->
<section id="main-content">
    <section class="wrapper site-min-height">
        <!-- page start-->
        <section class="panel">
            <header class="panel-heading">
                <i class="fa fa-user"></i>  Voter Database
            </header>
            <div class="panel-body">
                <div class="adv-table editable-table ">
                    <div class="clearfix">
                        <a data-toggle="modal" href="#myModal">
                            <div class="btn-group">
                                <button id="" class="btn green">
                                    <i class="fa fa-plus-circle"></i> Add Voter 
                                </button>
                            </div>
                        </a>
                        <button class="export" onclick="javascript:window.print();">Print</button>  
                    </div>
                    <div class="space15"></div>
                    <table class="table table-striped table-hover table-bordered" id="editable-sample">
                        <thead>
                            <tr>
                                <th>Voter Id</th>                        
                                <th>Image</th>
                                <th>Name</th>
                                <th>Area</th>
                                <th>Phone</th>
                                <th class="center">Email</th>
                                <th>Birth Date</th>
                                <th>Blood Group</th>
                                <th>Options</th>
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

                        <?php foreach ($voters as $voter) { ?>
                            <tr class="">
                                <td> <?php echo $voter->voter_id; ?></td>
                                <td style="width:8%;"><img style="width:95%;" src="<?php echo $voter->img_url; ?>"></td>
                                <td> <?php echo $voter->name; ?></td>
                                <td> <?php if(!empty($voter->name)){echo $voter->area;}?></td>
                                <td><?php echo $voter->phone; ?></td>
                                <td><?php echo $voter->email; ?></td>
                                <td class="center"><?php echo $voter->birthdate; ?></td>
                                <td style="width:6%;"><?php echo $voter->bloodgroup; ?></td>
                                <td>
                                    <button type="button" class="btn btn-info btn-xs btn_width editbutton" data-toggle="modal" data-id="<?php echo $voter->id; ?>"><i class="fa fa-edit"></i></button> 
                                    <a class="btn btn-info btn-xs btn_width delete_button" href="voter/delete?id=<?php echo $voter->id; ?>" onclick="return confirm('Are you sure you want to delete this item?');"><i class="fa fa-trash-o"></i></a>
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
                <h4 class="modal-title"><i class="fa fa-plus-circle"></i> Add New Voter</h4>
            </div>
            <div class="modal-body">
                <form role="form" action="voter/addNew" method="post" enctype="multipart/form-data">
                    <div class="form-group">
                        <div class="col-md-12">     
                            <div class="col-md-3">
                            </div>
                            <div class="col-md-6">
                                <div class="col-md-3 payment_label"> 
                                    <label for="exampleInputEmail1">Area</label>
                                </div>
                                <div class="col-md-9"> 
                                    <select class="form-control m-bot15" name="area" value=''> 
                                        <?php foreach ($areas as $area) { ?>
                                            <option value="<?php echo $area->name; ?>" <?php
                                            if (!empty($voter->area)) {
                                                if ($voter->area == $area->name) {
                                                    echo 'selected';
                                                }
                                            }
                                            ?> ><?php echo $area->name; ?> </option>
                                                <?php } ?>
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-3">
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="exampleInputEmail1">Voter Id</label>
                        <input type="text" class="form-control" name="voter_id" id="exampleInputEmail1" value='' placeholder="">
                    </div>
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
                        <label>Birth Date</label>
                        <input class="form-control form-control-inline input-medium default-date-picker" type="text" name="birthdate" value="<?php
                        if (!empty($voter->birthdate)) {
                            echo $voter->birthdate;
                        }
                        ?>" placeholder="">

                    </div>
                    <div class="form-group">
                        <label for="exampleInputEmail1">Blood Group</label>
                        <select class="form-control m-bot15" name="bloodgroup" value=''>
                            <?php foreach ($groups as $group) { ?>
                                <option value="<?php echo $group->gname; ?>" <?php
                                if (!empty($voter->bloodgroup)) {
                                    if ($group->gname == $voter->bloodgroup) {
                                        echo 'selected';
                                    }
                                }
                                ?> > <?php echo $group->gname; ?> </option>
                                    <?php } ?> 
                        </select>
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
<!-- Edit Client -->
<div class="modal fade" id="myModal2" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="display: none;">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h4 class="modal-title"><i class="fa fa-edit"></i> Edit Voter</h4>
            </div>
            <div class="modal-body">
                <form role="form" id="voterEditForm"  action="voter/addNew" method="post" enctype="multipart/form-data">
                    <div class="form-group">
                        <div class="col-md-12">     
                            <div class="col-md-3">
                            </div>
                            <div class="col-md-6">
                                <div class="col-md-3 payment_label"> 
                                    <label for="exampleInputEmail1">Area</label>
                                </div>
                                <div class="col-md-9"> 
                                    <select class="form-control m-bot15" name="area" value=''> 
                                        <?php foreach ($areas as $area) { ?>
                                            <option value="<?php echo $area->name; ?>" <?php
                                            if (!empty($voter->area)) {
                                                if ($voter->area == $area->name) {
                                                    echo 'selected';
                                                }
                                            }
                                            ?> ><?php echo $area->name; ?> </option>
                                                <?php } ?>
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-3">
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="exampleInputEmail1">Voter Id</label>
                        <input type="text" class="form-control" name="voter_id" id="exampleInputEmail1" value='' placeholder="">
                    </div>
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
                        <label>Birth Date</label>
                        <input class="form-control form-control-inline input-medium default-date-picker" type="text" name="birthdate" value="<?php
                        if (!empty($voter->birthdate)) {
                            echo $voter->birthdate;
                        }
                        ?>" placeholder="">

                    </div>
                    <div class="form-group">
                        <label for="exampleInputEmail1">Blood Group</label>
                        <select class="form-control m-bot15" name="bloodgroup" value=''>
                            <?php foreach ($groups as $group) { ?>
                                <option value="<?php echo $group->gname; ?>" <?php
                                if (!empty($voter->bloodgroup)) {
                                    if ($group->gname == $voter->bloodgroup) {
                                        echo 'selected';
                                    }
                                }
                                ?> > <?php echo $group->gname; ?> </option>
                                    <?php } ?> 
                        </select>
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





<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script type="text/javascript">


                                        $(document).ready(function () {
                                            $(".editbutton").click(function (e) {
                                                e.preventDefault(e);
                                                // Get the record's ID via attribute  
                                                var iid = $(this).attr('data-id');
                                                $('#voterEditForm').trigger("reset");
                                                $('#myModal2').modal('show');
                                                $.ajax({
                                                    url: 'voter/editVoterByJason?id=' + iid,
                                                    method: 'GET',
                                                    data: '',
                                                    dataType: 'json',
                                                }).success(function (response) {
                                                    // Populate the form fields with the data returned from server
                                                    $('#voterEditForm').find('[name="area"]').val(response.voter.area).end()
                                                    $('#voterEditForm').find('[name="id"]').val(response.voter.id).end()
                                                    $('#voterEditForm').find('[name="voter_id"]').val(response.voter.voter_id).end()
                                                    $('#voterEditForm').find('[name="name"]').val(response.voter.name).end()
                                                    $('#voterEditForm').find('[name="password"]').val(response.voter.password).end()
                                                    $('#voterEditForm').find('[name="email"]').val(response.voter.email).end()
                                                    $('#voterEditForm').find('[name="address"]').val(response.voter.address).end()
                                                    $('#voterEditForm').find('[name="phone"]').val(response.voter.phone).end()
                                                    $('#voterEditForm').find('[name="sex"]').val(response.voter.sex).end()
                                                    $('#voterEditForm').find('[name="birthdate"]').val(response.voter.birthdate).end()
                                                    $('#voterEditForm').find('[name="bloodgroup"]').val(response.voter.bloodgroup).end()
                                                });

                                            });
                                        });

</script>

<script>
    $(document).ready(function () {
        $(".flashmessage").delay(3000).fadeOut(100);
    });
</script>