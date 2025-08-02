
<!--sidebar end-->
<!--main content start-->
<section id="main-content">
    <section class="wrapper site-min-height">
        <!-- page start-->
        <section class="panel">
            <header class="panel-heading">
                <?php
                if (!empty($voter->id))
                    echo 'Edit Voter';
                else
                    echo 'Add New Voter';
                ?>
            </header>

            <div class="panel-body">
                <div class="adv-table editable-table ">
                    <div class="clearfix">

                        <div class="col-lg-12">

                            <section class="panel">

                                <div class="panel-body">
                                    <?php echo $this->session->flashdata('feedback'); ?>
                                    <div class="col-lg-12">
                                        <div class="col-lg-3"></div>
                                        <div class="col-lg-6">
                                            <?php echo validation_errors(); ?>

                                        </div>
                                        <div class="col-lg-3"></div>
                                    </div>

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
                                            <input type="text" class="form-control" name="voter_id" id="exampleInputEmail1" value='<?php
                                            if (!empty($voter->voter_id)) {
                                                echo $voter->voter_id;
                                            }
                                            ?>' placeholder="">
                                        </div>

                                        <div class="form-group">
                                            <label for="exampleInputEmail1">Name</label>
                                            <input type="text" class="form-control" name="name" id="exampleInputEmail1" value='<?php
                                            if (!empty($voter->name)) {
                                                echo $voter->name;
                                            }
                                            ?>' placeholder="">
                                        </div>
                                        
                                        <div class="form-group">
                                            <label for="exampleInputEmail1">Email</label>
                                            <input type="text" class="form-control" name="email" id="exampleInputEmail1" value='<?php
                                            if (!empty($voter->email)) {
                                                echo $voter->email;
                                            }
                                            ?>' placeholder="">
                                        </div>
                                        <div class="form-group">
                                            <label for="exampleInputEmail1">Address</label>
                                            <input type="text" class="form-control" name="address" id="exampleInputEmail1" value='<?php
                                            if (!empty($voter->address)) {
                                                echo $voter->address;
                                            }
                                            ?>' placeholder="">
                                        </div>
                                        <div class="form-group">
                                            <label for="exampleInputEmail1">Phone</label>
                                            <input type="text" class="form-control" name="phone" id="exampleInputEmail1" value='<?php
                                            if (!empty($voter->phone)) {
                                                echo $voter->phone;
                                            }
                                            ?>' placeholder="">
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

                                        <input type="hidden" name="id" value='<?php
                                        if (!empty($voter->id)) {
                                            echo $voter->id;
                                        }
                                        ?>'>
                                        <input type="hidden" name="p_id" value='<?php
                                        if (!empty($voter->voter_id)) {
                                            echo $voter->voter_id;
                                        }
                                        ?>'>

                                        <section class="">
                                            <button type="submit" name="submit" class="btn btn-info">Submit</button>
                                        </section>
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
