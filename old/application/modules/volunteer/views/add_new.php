
<!--sidebar end-->
<!--main content start-->
<section id="main-content">
    <section class="wrapper site-min-height">
        <!-- page start-->
        <section class="panel">
            <header class="panel-heading">
                <?php
                if (!empty($volunteer->id))
                    echo 'Edit Volunteer';
                else
                    echo 'Add Volunteer';
                ?>
            </header>
            <div class="panel-body">
                <div class="adv-table editable-table ">
                    <div class="clearfix">

                        <div class="col-lg-12">
                            <section class="panel">
                                <div class="panel-body">
                                    <div class="col-lg-12">
                                        <div class="col-lg-3"></div>
                                        <div class="col-lg-6">
                                            <?php echo validation_errors(); ?>
                                            <?php echo $this->session->flashdata('feedback'); ?>
                                        </div>
                                        <div class="col-lg-3"></div>
                                    </div>
                                    <form role="form" action="volunteer/addNew" method="post" enctype="multipart/form-data">
                                        <div class="form-group">

                                            <label for="exampleInputEmail1">Name</label>
                                            <input type="text" class="form-control" name="name" id="exampleInputEmail1" value='<?php
                                            if (!empty($volunteer->name)) {
                                                echo $volunteer->name;
                                            }
                                            ?>' placeholder="">

                                        </div>
                                        <!--
                                        <div class="form-group">


                                            <label for="exampleInputEmail1">Password</label>
                                            <input type="password" class="form-control" name="password" id="exampleInputEmail1" placeholder="********">

                                        </div>
                                        -->
                                        <div class="form-group">
                                            <label for="exampleInputEmail1">Email</label>
                                            <input type="text" class="form-control" name="email" id="exampleInputEmail1" value='<?php
                                            if (!empty($volunteer->email)) {
                                                echo $volunteer->email;
                                            }
                                            ?>' placeholder="">
                                        </div>
                                        <div class="form-group">
                                            <label for="exampleInputEmail1">Address</label>
                                            <input type="text" class="form-control" name="address" id="exampleInputEmail1" value='<?php
                                            if (!empty($volunteer->address)) {
                                                echo $volunteer->address;
                                            }
                                            ?>' placeholder="">
                                        </div>
                                        <div class="form-group">
                                            <label for="exampleInputEmail1">Phone</label>
                                            <input type="text" class="form-control" name="phone" id="exampleInputEmail1" value='<?php
                                            if (!empty($volunteer->phone)) {
                                                echo $volunteer->phone;
                                            }
                                            ?>' placeholder="">
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
                                            <input type="text" class="form-control" name="profile" id="exampleInputEmail1" value='<?php
                                            if (!empty($volunteer->profile)) {
                                                echo $volunteer->profile;
                                            }
                                            ?>' placeholder="">
                                        </div>

                                        <div class="form-group">
                                            <label for="exampleInputEmail1">Image</label>
                                            <input type="file" name="img_url">
                                        </div>

                                        <input type="hidden" name="id" value='<?php
                                        if (!empty($volunteer->id)) {
                                            echo $volunteer->id;
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
