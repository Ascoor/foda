<!--sidebar end-->
<!--main content start-->
<section id="main-content">
    <section class="wrapper site-min-height">
        <!-- page start-->
        <section class="panel">
            <header class="panel-heading">
                <?php
                if (!empty($snw->type)) {
                    if ($snw->type == 1) {
                        echo 'Edit Strength';
                    } elseif ($snw->type == 2) {
                        echo 'Edit Weakness';
                    } elseif ($snw->type == 3) {
                        echo 'Edit Opportunity';
                    } elseif ($snw->type == 4) {
                        echo 'Edit Threat';
                    }
                } else {
                    if ($typeOfAnalysis == 1) {
                        echo 'Add New Strength';
                    } elseif ($typeOfAnalysis == 2) {
                        echo 'Add New Weakness';
                    } elseif ($typeOfAnalysis == 3) {
                        echo 'Add New Opportunity';
                    } elseif ($typeOfAnalysis == 4) {
                        echo 'Add New Threat';
                    }
                }
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
                                    <form role="form" id="snwAddForm" action="snw/addNew" method="post" enctype="multipart/form-data">
                                        <input type="hidden" name="type" value='<?php
                                        if (!empty($snw->id)) {
                                            echo $snw->type;
                                        } else {
                                            echo $typeOfAnalysis;
                                        }
                                        ?>'>
                                        <div class="form-group">
                                            <label for="exampleInputEmail1">Topic</label>
                                            <input type="text" class="form-control" name="topic" id="exampleInputEmail1" value='<?php
                                            if (!empty($snw->topic)) {
                                                echo $snw->topic;
                                            }
                                            ?>' placeholder="">
                                        </div>
                                        <div class="form-group">
                                            <label for="exampleInputEmail1">Note</label>
                                            <input type="text" class="form-control" name="note" id="exampleInputEmail1" value='<?php
                                            if (!empty($snw->note)) {
                                                echo $snw->note;
                                            }
                                            ?>' placeholder="">
                                        </div>
                                        <input type="hidden" name="id" value=''>
                                        <section class="">
                                            <button type="submit" name="submit" class="btn btn-info submit_button">Submit</button>
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
