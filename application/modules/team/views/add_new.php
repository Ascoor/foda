
<!--sidebar end-->
<!--main content start-->
<section id="main-content">
    <section class="wrapper site-min-height">
        <!-- page start-->
        <section class="panel">
            <header class="panel-heading">
                Add Team
            </header>
            <div class="panel-body">
                <div class="adv-table editable-table ">
                    <div class="clearfix">
                        <div class="col-lg-12">
                            <section class="panel">
                                <div class="panel-body">
                                    <?php echo validation_errors(); ?>
                                    <form role="form" action="team/addNew" method="post" class="">
                                        <div class="form-group col-md-12">
                                            <label class="control-label col-md-3">Name</label>
                                            <div class="col-md-9">
                                                <input type="text" class="form-control" name="name" id="exampleInputEmail1" value='<?php
                                                if (!empty($team->name)) {
                                                    echo $team->name;
                                                }
                                                ?>' placeholder="">
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
                                                <?php  ?>
                                                <select name="members[]" class="multi-select" multiple="multiple" id="my_multi_select3" >
                                                    <?php foreach ($volunteers as $volunteer) { ?>
                                                        <option value="<?php echo $volunteer->id; ?>" <?php if(!empty($team->members)){$members = explode(',', $team->members); if(in_array($volunteer->id,$members)){ echo 'selected';}}?>> <?php echo $volunteer->name; ?> </option>
                                                    <?php } ?>
                                                </select>
                                            </div>

                                        </div>


                                        
                                        <div class="form-group col-md-12">
                                            <label class="control-label col-md-3">Task</label>
                                            <div class="col-md-9">
                                                <input type="text" class="form-control" name="task" id="exampleInputEmail1" value='<?php
                                                if (!empty($team->task)) {
                                                    echo $team->task;
                                                }
                                                ?>' placeholder="">
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
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!-- page end-->
    </section>
</section>
<!--main content end-->
<!--footer start-->
