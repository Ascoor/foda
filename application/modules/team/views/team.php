<!--sidebar end-->
<!--main content start-->
<section id="main-content">
    <section class="wrapper site-min-height">
        <!-- page start-->
        <section class="panel">
            <header class="panel-heading">
                <i class="fa fa-users"></i> Team 
            </header>
            <div class="panel-body">
                <div class="adv-table editable-table ">
                    <div class="clearfix">
                        <a data-toggle="modal" href="#myModal">
                            <div class="btn-group">
                                <button id="" class="btn green">
                                    <i class="fa fa-plus-circle"></i> Add Team 
                                </button>
                            </div>
                        </a>
                        <button class="export" onclick="javascript:window.print();">Print</button>  
                    </div>
                    <div class="space15"></div>
                    <table class="table table-striped table-hover table-bordered" id="editable-sample">
                        <thead>
                            <tr>
                                <th>Team Name</th>
                                <th>Area</th>
                                <th>Members</th>
                                <th>Task</th>
                                <th>Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($teams as $team) { ?>
                                <tr class="">
                                    <td><?php echo $team->name; ?></td>
                                    <td><?php
                                        if (!empty($team->area)) {
                                            echo $team->area;
                                        }
                                        ?></td>
                                    <td style="width: 50%">
                                        <?php
                                        if (!empty($team->members)) {
                                            $members = explode(',', $team->members);
                                            foreach ($members as $member) {
                                                if (is_numeric($member)) {
                                                    echo'<strong>' . $this->db->get_where('volunteer', array('id' => $member))->row()->name . '</strong>, ';
                                                } else {
                                                    echo '';
                                                }
                                            }
                                        }
                                        ?>
                                    </td>
                                    <td><?php echo $team->task; ?></td>
                                    <td>
                                        <a href="team/teamdetails?team_id=<?php echo $team->id; ?>">  <button type="button" style="width: 50px;" class="btn btn-info btn-xs btn_width">Details</button> </a>
                                        <button type="button" style="width: 35px;" class="btn btn-info btn-xs btn_width editbutton" data-toggle="modal" data-id="<?php echo $team->id; ?>"><i class="fa fa-edit"></i></button> 
                                        <a class="btn btn-info btn-xs btn_width delete_button" href="team/delete?id=<?php echo $team->id; ?>" onclick="return confirm('Are you sure you want to delete this item?');"><i class="fa fa-trash-o"></i></a>
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

<!-- Add Team Modal-->
<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="display: none;">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h4 class="modal-title"><i class="fa fa-plus-circle"></i> Add Team</h4>
            </div>
            <div class="modal-body">
                <form role="form" action="team/addNew" method="post" class="">
                    <div class="form-group col-md-12">
                        <label class="control-label col-md-3">Team Name</label>
                        <div class="col-md-9">
                            <input type="text" class="form-control" name="name" id="exampleInputEmail1" value='' placeholder="">
                        </div>
                    </div>
                    <div class="form-group col-md-12">
                        <label class="control-label col-md-3"></label>
                        <div class="col-md-9">
                        </div>
                    </div>
                    <div class="form-group col-md-12">
                        <label class="control-label col-md-3">Area</label>
                        <div class="col-md-9">
                            <select class="form-control m-bot15" name="area" value=''> 
                                <?php foreach ($areas as $area) { ?>
                                    <option value="<?php echo $area->name; ?>" <?php
                                    if (!empty($team->area)) {
                                        if ($team->area == $area->name) {
                                            echo 'selected';
                                        }
                                    }
                                    ?> ><?php echo $area->name; ?> </option>
<?php } ?>
                            </select>
                        </div>
                    </div>

                    <div class="form-group col-md-12">
                        <label class="control-label col-md-3">Team Members</label>
                        <div class="col-md-9">
                            <select name="members[]" class="multi-select" multiple="multiple" id="my_multi_select3" >
                                <?php foreach ($volunteers as $volunteer) { ?>
                                    <option value="<?php echo $volunteer->id; ?>"><?php echo $volunteer->name; ?> </option>
<?php } ?>
                            </select>
                        </div>

                    </div>



                    <div class="form-group col-md-12">
                        <label class="control-label col-md-3">Task</label>
                        <div class="col-md-9">
                            <input type="text" class="form-control" name="task" id="exampleInputEmail1" value='' placeholder="">
                        </div>
                    </div>
                    <input type="hidden" name="id" value=''>
                    <button type="submit" name="submit" class="btn btn-info">Submit</button>
                </form>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div>
<!-- Add Team Modal-->

<!-- Edit Team Modal-->
<div class="modal fade" id="myModal2" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="display: none;">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h4 class="modal-title"><i class="fa fa-edit"></i> Edit Team</h4>
            </div>
            <div class="modal-body">
                <form role="form" id="teamEditForm" action="team/addNew" method="post" class="">
                    <div class="form-group col-md-12">
                        <label class="control-label col-md-3">Team Name</label>
                        <div class="col-md-9">
                            <input type="text" class="form-control" name="name" id="exampleInputEmail1" value='' placeholder="">
                        </div>
                    </div>
                    <div class="form-group col-md-12">
                        <label class="control-label col-md-3"></label>
                        <div class="col-md-9">
                        </div>
                    </div>
                    <div class="form-group col-md-12">
                        <label class="control-label col-md-3">Area</label>
                        <div class="col-md-9">
                            <select class="form-control m-bot15" name="area" value=''> 
                                <?php foreach ($areas as $area) { ?>
                                    <option value="<?php echo $area->name; ?>" <?php
                                    if (!empty($team->area)) {
                                        if ($team->area == $area->name) {
                                            echo 'selected';
                                        }
                                    }
                                    ?> ><?php echo $area->name; ?> </option>
<?php } ?>
                            </select>
                        </div>
                    </div>

                    <div class="form-group col-md-12">
                        <label class="control-label col-md-3">Team Members</label>
                        <div class="col-md-9">
                            <select name="members[]" class="multi-select" multiple="multiple" id="my_multi_select3" >
                                <?php foreach ($volunteers as $volunteer) { ?>
                                    <option value="<?php echo $volunteer->id; ?>"><?php echo $volunteer->name; ?> </option>
<?php } ?>
                            </select>
                        </div>

                    </div>



                    <div class="form-group col-md-12">
                        <label class="control-label col-md-3">Task</label>
                        <div class="col-md-9">
                            <input type="text" class="form-control" name="task" id="exampleInputEmail1" value='' placeholder="">
                        </div>
                    </div>

                    <input type="hidden" name="id" value=''>
                    <button type="submit" name="submit" class="btn btn-info">Submit</button>
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
                                                $('#teamEditForm').trigger("reset");
                                                $('#myModal2').modal('show');
                                                $.ajax({
                                                    url: 'team/editTeamByJason?id=' + iid,
                                                    method: 'GET',
                                                    data: '',
                                                    dataType: 'json',
                                                }).success(function (response) {
                                                    // Populate the form fields with the data returned from server
                                                    $('#teamEditForm').find('[name="id"]').val(response.team.id).end()
                                                    $('#teamEditForm').find('[name="name"]').val(response.team.name).end()
                                                    $('#teamEditForm').find('[name="area"]').val(response.team.area).end()
                                                    $('#teamEditForm').find('[name="members"]').val(response.team.members).end()
                                                    $('#teamEditForm').find('[name="task"]').val(response.team.task).end()

                                                    //  var dataarray = response.team.members.split(',');
                                                    //   $("#my_multi_select3").val(dataarray);
                                                    //  $("#my_multi_select3").multiselect("refresh");

                                                    var values = response.team.members;
                                                    $.each(values.split(","), function (i, e) {
                                                        $("#my_multi_select3 option[value='" + e + "']").prop("selected", true);
                                                    });


                                                });

                                            });
                                        });

</script>
<script>
    $(document).ready(function () {
        $(".flashmessage").delay(3000).fadeOut(100);
    });
</script>

