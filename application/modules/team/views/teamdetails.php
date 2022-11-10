<!--sidebar end-->
<!--main content start-->
<section id="main-content">
    <section class="wrapper site-min-height">
        <!-- page start-->
        <section class="panel">
            <header class="panel-heading">
                <i class="fa fa-home"></i> Team Details 
            </header>
            <div class="panel-body">
                <div class="col-md-3">
                    <section>
                        <div class="task-thumb-details">
                            <p>Team Name</p>
                            <h1><?php echo $team_details->name; ?></h1> <br><br>
                            <p>Team Location</p>
                            <h1><?php echo $team_details->area; ?></h1> <br><br>
                            <p>Team Task</p>
                            <h1><?php echo $team_details->task; ?></h1> <br>
                        </div>    
                    </section>
                </div>
                <div class="adv-table editable-table col-md-9">
                    <div class="clearfix">
                        <a data-toggle="modal" href="#myModal">
                            <div class="btn-group">
                                <button id="" class="btn green">
                                    <i class="fa fa-plus-circle"></i>  Add Team member 
                                </button>
                            </div>
                        </a>
                        <button class="export" onclick="javascript:window.print();">Print</button>  
                    </div>
                    <div class="space15"></div>
                    <table class="table table-striped table-hover table-bordered" id="editable-sample">
                        <thead>
                            <tr>
                                <th>Team Members</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php
                            $teammembers = explode(',', $team_details->members);
                            foreach ($teammembers as $teammember) {
                                if (is_numeric($teammember)) {
                                    $teammember = $this->db->get_where('volunteer', array("id" => $teammember))->row();
                                    ?>
                                    <tr class="">
                                        <td><?php echo $teammember->name; ?></td>
                                        <td><?php echo $teammember->email; ?></td>
                                        <td><?php echo $teammember->phone; ?></td>
                                        <td>
                                            <a class="btn btn-info btn-xs btn_width delete_button" href="team/deleteTeamMember?team_id=<?php echo $team_details->id; ?>&member_id=<?php echo $teammember->id; ?>" onclick="return confirm('Are you sure you want to delete this item?');"><i class="fa fa-trash-o"></i></a>
                                        </td>
                                    </tr>
                                    <?php
                                }
                            }
                            ?>
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
                <h4 class="modal-title">Add Team Member</h4>
            </div>
            <div class="modal-body">
                <form role="form" action="team/addTeamMember" method="post">  
                    <div class="col-md-9">
                        <select name="members[]" class="multi-select" multiple="multiple" id="my_multi_select3" >
                            <?php foreach ($volunteers as $volunteer) { ?>
                                <option value="<?php echo $volunteer->id; ?>"><?php echo $volunteer->name; ?> </option>
                            <?php } ?>
                        </select>
                    </div>
                    <input type="hidden" name="team_id" value='<?php echo $team_details->id; ?>'>
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
                <h4 class="modal-title">Edit Team</h4>
            </div>
            <div class="modal-body">
                <form role="form" id="teamEditForm" action="team/addNew" method="post">
                    <div class="form-group col-md-12">
                        <label class="control-label col-md-3">Name</label>
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
                            <textarea class="ckeditor form-control" name="area" value="" rows="10"></textarea>
                        </div>
                    </div>
                    <div class="form-group col-md-12">
                        <label class="control-label col-md-3">Members</label>
                        <div class="col-md-9">
                            <input type="text" class="form-control" name="members" id="exampleInputEmail1" value='' placeholder="">
                        </div>
                    </div>
                    <div class="form-group col-md-12">
                        <label class="control-label col-md-3">Task</label>
                        <div class="col-md-9">
                            <input type="text" class="form-control" name="task" id="exampleInputEmail1" value='' placeholder="">
                        </div>
                    </div>
                    <input type="hidden" name="id" value='<?php
                    if (!empty($team->id)) {
                        echo $team->id;
                    }
                    ?>'>
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
                                                        $.ajax({
                                                            url: 'team/editTeamByJason?id=' + iid,
                                                            method: 'GET',
                                                            data: '',
                                                            dataType: 'json',
                                                        }).success(function (response) {
                                                            // Populate the form fields with the data returned from server
                                                            $('#teamEditForm').find('[name="id"]').val(response.team.id).end()
                                                            $('#teamEditForm').find('[name="name"]').val(response.team.name).end()
                                                            $('#teamEditForm').find('[name="area"]').text(response.team.area).end()
                                                            $('#teamEditForm').find('[name="members"]').val(response.team.members).end()
                                                            $('#teamEditForm').find('[name="task"]').text(response.team.task).end()
                                                            //   CKEDITOR.instances['editor1'].setData(html)

                                                            $('#myModal2').modal('show');
                                                        });

                                                    });
                                                });

</script>
<script>
    $(document).ready(function () {
        $(".flashmessage").delay(3000).fadeOut(100);
    });
</script>
