<!--sidebar end-->
<!--main content start-->
<section id="main-content">
    <section class="wrapper site-min-height">
        <!-- page start-->
        <section class="panel">
            <header class="panel-heading">
                <i class="fa fa-calendar-o"></i>  Event Database
            </header>
            <div class="panel-body">
                <div class="adv-table editable-table ">
                    <div class="clearfix">
                        <a data-toggle="modal" href="#myModal">
                            <div class="btn-group">
                                <button id="" class="btn green">
                                    <i class="fa fa-plus-circle"></i> Add Event 
                                </button>
                            </div>
                        </a>
                        <button class="export" onclick="javascript:window.print();">Print</button>  
                    </div>
                    <div class="space15"></div>
                    <table class="table table-striped table-hover table-bordered" id="editable-sample">
                        <thead>
                            <tr>                                  
                                <th>Organiser</th>
                                <th>Location</th>
                                <th>Contact</th>
                                <th>Date</th>
                                <th>Subject</th>
                                <th>Description</th>
                                <th>Guests</th>
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
                        <?php foreach ($events as $event) { ?>
                            <tr class="">
                                <td> <?php echo $event->organiser; ?></td>
                                <td> <?php echo $event->location; ?></td>
                                <td><?php echo $event->contact; ?></td>
                                <td> <?php echo $event->date; ?> <?php
                                    if (strtotime($event->date) > time()) {
                                        echo '<p class="upcoming"> Upcoming </p>';
                                    }
                                    ?></td>
                                <td> <?php echo $event->subject; ?></td>
                                <td><?php echo $event->description; ?></td>
                                <td><?php echo $event->guests; ?></td>
                                <td>
                                 <!--   <a class="" href="event/eventDetails?id=<?php echo $event->id; ?>"><i class="fa fa details">details</i></a> -->
                                    <button type="button" class="btn btn-info btn-xs btn_width editbutton" data-toggle="modal" data-id="<?php echo $event->id; ?>"><i class="fa fa-edit"></i></button>   
                                    <a class="btn btn-info btn-xs btn_width delete_button" href="event/delete?id=<?php echo $event->id; ?>" onclick="return confirm('Are you sure you want to delete this item?');"><i class="fa fa-trash-o"></i></a>
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

<!-- Add Event Modal-->
<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="display: none;">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h4 class="modal-title"><i class="fa fa-plus-circle"></i> Add New Event</h4>
            </div>
            <div class="modal-body">
                <form role="form" action="event/addNew" method="post" enctype="multipart/form-data">

                    <div class="form-group">
                        <label for="exampleInputEmail1">Event Organiser</label>
                        <input type="text" class="form-control" name="organiser" id="exampleInputEmail1" value='' placeholder="">
                    </div>
                    <div class="form-group">
                        <label for="exampleInputEmail1">Event Location</label>
                        <input type="text" class="form-control" name="location" id="exampleInputEmail1" value='' placeholder="">
                    </div>
                    <div class="form-group">
                        <label for="exampleInputEmail1">Event Contact Number</label>
                        <input type="text" class="form-control" name="contact" id="exampleInputEmail1" value='' placeholder="">
                    </div>
                    <div class="form-group">
                        <label>Date</label>
                        <input class="form-control form-control-inline input-medium default-date-picker" type="text" name="date" value="" placeholder="">
                    </div>
                    <div class="form-group">
                        <label for="exampleInputEmail1">Subject</label>
                        <input type="text" class="form-control" name="subject" id="exampleInputEmail1" value='' placeholder="">
                    </div>
                    <div class="form-group">
                        <label for="exampleInputEmail1">Description</label>
                        <input type="text" class="form-control" name="description"  id="exampleInputEmail1" placeholder="" value=''>
                    </div>
                    <div class="form-group">
                        <label for="exampleInputEmail1">Guests</label>
                        <input type="text" class="form-control" name="guests" id="exampleInputEmail1" value='' placeholder="">
                    </div>
                    <input type="hidden" name="id" value=''>
                    <section class="">
                        <button type="submit" name="submit" class="btn btn-info">Submit</button>
                    </section>
                </form>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div>
<!-- Add Event Modal-->

<!-- Edit Event Modal-->
<div class="modal fade" id="myModal2" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="display: none;">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h4 class="modal-title"><i class="fa fa-edit"></i> Edit Event</h4>
            </div>
            <div class="modal-body">
                <form role="form" id="editEventForm" action="event/addNew" method="post" enctype="multipart/form-data">
                    <div class="form-group">
                        <label for="exampleInputEmail1">Event Organiser</label>
                        <input type="text" class="form-control" name="organiser" id="exampleInputEmail1" value='' placeholder="">
                    </div>
                    <div class="form-group">
                        <label for="exampleInputEmail1">Event Location</label>
                        <input type="text" class="form-control" name="location" id="exampleInputEmail1" value='' placeholder="">
                    </div>
                    <div class="form-group">
                        <label for="exampleInputEmail1">Event Contact Number</label>
                        <input type="text" class="form-control" name="contact" id="exampleInputEmail1" value='' placeholder="">
                    </div>
                    <div class="form-group">
                        <label>Date</label>
                        <input class="form-control form-control-inline input-medium default-date-picker" type="text" name="date" value="" placeholder="">

                    </div>
                    <div class="form-group">
                        <label for="exampleInputEmail1">Subject</label>
                        <input type="text" class="form-control" name="subject" id="exampleInputEmail1" value='' placeholder="">
                    </div>
                    <div class="form-group">
                        <label for="exampleInputEmail1">Description</label>
                        <input type="text" class="form-control" name="description"  id="exampleInputEmail1" placeholder="" value=''>
                    </div>
                    <div class="form-group">
                        <label for="exampleInputEmail1">Guests</label>
                        <input type="text" class="form-control" name="guests" id="exampleInputEmail1" value='' placeholder="">
                    </div>
                    <input type="hidden" name="id" value='<?php
                    if (!empty($event->id)) {
                        echo $event->id;
                    }
                    ?>'>
                    <section class="">
                        <button type="submit" name="submit" class="btn btn-info">Submit</button>
                    </section>
                </form>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div>
<!-- Edit Event Modal-->

<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script type="text/javascript">
                                    $(document).ready(function () {
                                        $(".editbutton").click(function (e) {
                                            e.preventDefault(e);
                                            // Get the record's ID via attribute  
                                            var iid = $(this).attr('data-id');
                                            $('#editEventForm').trigger("reset");
                                            $('#myModal2').modal('show');
                                            $.ajax({
                                                url: 'event/editEventByJason?id=' + iid,
                                                method: 'GET',
                                                data: '',
                                                dataType: 'json',
                                            }).success(function (response) {
                                                // Populate the form fields with the data returned from server
                                                $('#editEventForm').find('[name="id"]').val(response.event.id).end()
                                                //   $('#editEventForm').find('[name="p_id"]').val(response.client.client_id).end()
                                                $('#editEventForm').find('[name="area"]').val(response.event.area).end()
                                                $('#editEventForm').find('[name="organiser"]').val(response.event.organiser).end()
                                                $('#editEventForm').find('[name="location"]').val(response.event.location).end()
                                                $('#editEventForm').find('[name="contact"]').val(response.event.contact).end()
                                                $('#editEventForm').find('[name="date"]').val(response.event.date).end()
                                                $('#editEventForm').find('[name="subject"]').val(response.event.subject).end()
                                                $('#editEventForm').find('[name="description"]').val(response.event.description).end()
                                                $('#editEventForm').find('[name="guests"]').val(response.event.guests).end()
                                            });

                                        });
                                    });
</script>
<script>
    $(document).ready(function () {
        $(".flashmessage").delay(3000).fadeOut(100);
    });
</script>