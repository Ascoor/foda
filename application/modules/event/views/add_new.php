<!--main content start-->
<section id="main-content">
    <section class="wrapper site-min-height">
        <!-- page start-->
        <section class="panel">
            <header class="panel-heading">
                <?php
                if (!empty($event->id))
                    echo 'Edit Event';
                else
                    echo 'Add New Event';
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
                                    <form role="form" action="event/addNew" method="post" enctype="multipart/form-data">
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
                                                                if (!empty($event->area)) {
                                                                    if ($event->area == $area->name) {
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
                                            <label for="exampleInputEmail1">Event Organiser</label>
                                            <input type="text" class="form-control" name="organiser" id="exampleInputEmail1" value='<?php
                                            if (!empty($event->organiser)) {
                                                echo $event->organiser;
                                            }
                                            ?>' placeholder="">
                                        </div>
                                        <div class="form-group">
                                            <label for="exampleInputEmail1">Event Location</label>
                                            <input type="text" class="form-control" name="location" id="exampleInputEmail1" value='<?php
                                            if (!empty($event->location)) {
                                                echo $event->location;
                                            }
                                            ?>' placeholder="">
                                        </div>
                                        <div class="form-group">
                                            <label for="exampleInputEmail1">Event Contact Number</label>
                                            <input type="text" class="form-control" name="contact" id="exampleInputEmail1" value='<?php
                                            if (!empty($event->contact)) {
                                                echo $event->contact;
                                            }
                                            ?>' placeholder="">
                                        </div>
                                        <div class="form-group">
                                            <label>Date</label>
                                            <input class="form-control form-control-inline input-medium default-date-picker" type="text" name="date" value="<?php
                                            if (!empty($event->date)) {
                                                echo $event->date;
                                            }
                                            ?>" placeholder="">
                                        </div>
                                        <div class="form-group">
                                            <label for="exampleInputEmail1">Subject</label>
                                            <input type="text" class="form-control" name="subject" id="exampleInputEmail1" value='<?php
                                            if (!empty($event->subject)) {
                                                echo $event->subject;
                                            }
                                            ?>' placeholder="">
                                        </div>
                                        <div class="form-group">
                                            <label for="exampleInputEmail1">Description</label>
                                            <input type="text" class="form-control" name="description"  id="exampleInputEmail1" placeholder="" value='<?php
                                            if (!empty($event->description)) {
                                                echo $event->description;
                                            }
                                            ?>'>
                                        </div>
                                        <div class="form-group">
                                            <label for="exampleInputEmail1">Guests</label>
                                            <input type="text" class="form-control" name="guests" id="exampleInputEmail1" value='<?php
                                            if (!empty($event->guests)) {
                                                echo $event->guests;
                                            }
                                            ?>' placeholder="">
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
