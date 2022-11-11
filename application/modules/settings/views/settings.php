<!--sidebar end-->
<!--main content start-->
<section id="main-content">
    <section class="wrapper site-min-height">
        <!-- page start-->
        <section class="panel">
            <header class="panel-heading">
                <i class="fa fa-gears"></i> General Settings
            </header>
            <div class="panel-body">
                <div class="adv-table editable-table ">
                    <div class="clearfix">
                        <div class="col-lg-12">
                            <section class="panel">
                                <div class="panel-body">
                                    <?php echo validation_errors(); ?>
                                    <form role="form" action="settings/update" method="post" enctype="multipart/form-data">
                                        <div class="form-group">
                                            <label for="exampleInputEmail1">System Name</label>
                                            <input type="text" class="form-control" name="name" id="exampleInputEmail1" value='<?php
                                            if (!empty($settings->system_vendor)) {
                                                echo $settings->system_vendor;
                                            }
                                            ?>' placeholder="system name">
                                        </div>
                                        <div class="form-group">
                                            <label for="exampleInputEmail1">Title</label>
                                            <input type="text" class="form-control" name="title" id="exampleInputEmail1" value='<?php
                                            if (!empty($settings->title)) {
                                                echo $settings->title;
                                            }
                                            ?>' placeholder="title">
                                        </div>
                                        <div class="form-group">
                                            <label for="exampleInputEmail1">Address</label>
                                            <input type="text" class="form-control" name="address" id="exampleInputEmail1" value='<?php
                                            if (!empty($settings->address)) {
                                                echo $settings->address;
                                            }
                                            ?>' placeholder="address">
                                        </div>
                                        <div class="form-group">
                                            <label for="exampleInputEmail1">Phone</label>
                                            <input type="text" class="form-control" name="phone" id="exampleInputEmail1" value='<?php
                                            if (!empty($settings->phone)) {
                                                echo $settings->phone;
                                            }
                                            ?>' placeholder="phone">
                                        </div>
                                        <div class="form-group">
                                            <label for="exampleInputEmail1">System Email</label>
                                            <input type="text" class="form-control" name="email" id="exampleInputEmail1" value='<?php
                                            if (!empty($settings->email)) {
                                                echo $settings->email;
                                            }
                                            ?>' placeholder="email">
                                        </div>
                                        <div class="form-group">
                                            <label for="exampleInputEmail1">Currency</label>
                                            <input type="text" class="form-control" name="currency" id="exampleInputEmail1" value='<?php
                                            if (!empty($settings->currency)) {
                                                echo $settings->currency;
                                            }
                                            ?>' placeholder="currency">
                                        </div>
                                        <div class="form-group hidden">
                                            <label for="exampleInputEmail1">Buyer</label>
                                            <input type="hidden" class="form-control" name="buyer" id="exampleInputEmail1" value='<?php
                                            if (!empty($settings->codec_username)) {
                                                echo $settings->buyer;
                                            }
                                            ?>' placeholder="codec_username">
                                        </div>
                                        <div class="form-group hidden">
                                            <label for="exampleInputEmail1">Purchase Code</label>
                                            <input type="hidden" class="form-control" name="p_code" id="exampleInputEmail1" value='<?php
                                            if (!empty($settings->codec_purchase_code)) {
                                                echo $settings->phone;
                                            }
                                            ?>' placeholder="codec_purchase_code">
                                        </div>

                                        <input type="hidden" name="id" value='<?php
                                        if (!empty($settings->id)) {
                                            echo $settings->id;
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
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script>
    $(document).ready(function () {
        $(".flashmessage").delay(3000).fadeOut(100);
    });
</script>
