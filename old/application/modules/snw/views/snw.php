<!--sidebar end-->
<!--main content start-->
<section id="main-content">
    <section class="wrapper site-min-height">
        <!-- page start-->
        <section class="panel">
            <header class="panel-heading">
                <i class="fa fa-archive"></i> Campaign Analysis
            </header>
            <div class="panel-body">
                <div class="adv-table editable-table col-md-6 padding" style="background: #f1f1f1;">
                    <div class="clearfix btn_margin">                        
                        <div class="btn-group">
                            <button id="" class="btn green addbutton" data-toggle="modal" href="#myModal" data-id="1">
                                <i class="fa fa-plus-circle"></i> Add Strength 
                            </button>
                        </div> 
                        <button class="export" onclick="javascript:window.print();">Print</button>  
                    </div>
                    <div class="space15"></div>
                    <table class="table table-striped table-hover table-bordered" id="">
                        <thead>
                            <tr>
                                <th>#</th>                        
                                <th>Strength</th>
                                <th>Note</th>
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
                        <?php
                        $i = 0;
                        foreach ($snws as $snw) {
                            if ($snw->type == '1') {
                                $i = $i + 1;
                                ?>
                                <tr class="">
                                    <td> <?php echo $i; ?></td>
                                    <td><?php echo $snw->topic; ?></td>
                                    <td> <?php echo $snw->note; ?></td>
                                    <td>     
                                        <button type="button" class="btn btn-info btn-xs btn_width editbutton" data-toggle="modal" data-id="<?php echo $snw->id; ?>"><i class="fa fa-edit"></i></button>
                                        <a class="btn btn-info btn-xs btn_width delete_button" href="snw/delete?id=<?php echo $snw->id; ?>" onclick="return confirm('Are you sure you want to delete this item?');"><i class="fa fa-trash-o"></i></a>
                                    </td>
                                </tr>
                                <?php
                            }
                        }
                        ?>
                        </tbody>
                    </table>
                </div>
                <div class="col-md-1"></div>
                <div class="adv-table editable-table col-md-5 padding" style="background: #f1f1f1;">
                    <div class="clearfix btn_margin">
                        <div class="btn-group">
                            <button id="" class="btn green addbutton" data-toggle="modal" href="#myModal" data-id="2">
                                <i class="fa fa-plus-circle"></i>  Add Weakness 
                            </button>
                        </div>                        
                        <button class="export" onclick="javascript:window.print();">Print</button>  
                    </div>
                    <div class="space15"></div>
                    <table class="table table-striped table-hover table-bordered" id="">
                        <thead>
                            <tr>
                                <th>#</th>                        
                                <th>Weakness</th>
                                <th>Note</th>
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
                        <?php
                        $i = 0;
                        foreach ($snws as $snw) {
                            if ($snw->type == '2') {
                                $i = $i + 1;
                                ?>                        
                                <tr class="">
                                    <td> <?php echo $i; ?></td>
                                    <td><?php echo $snw->topic; ?></td>
                                    <td> <?php echo $snw->note; ?></td>
                                    <td>
                                        <button type="button" class="btn btn-info btn-xs btn_width editbutton" data-toggle="modal" data-id="<?php echo $snw->id; ?>"><i class="fa fa-edit"></i></button>
                                        <a class="btn btn-info btn-xs btn_width delete_button" href="snw/delete?id=<?php echo $snw->id; ?>" onclick="return confirm('Are you sure you want to delete this item?');"><i class="fa fa-trash-o"></i></a>
                                    </td>
                                </tr>
                                <?php
                            }
                        }
                        ?>
                        </tbody>
                    </table>
                </div>
                <div class="col-md-12" style="height:10px;">                    
                </div>
                <div class="adv-table editable-table col-md-6 padding" style="background: #f1f1f1;">
                    <div class="clearfix btn_margin">
                        <div class="btn-group">
                            <button id="" class="btn green addbutton" data-toggle="modal" href="#myModal" data-id="3">
                                <i class="fa fa-plus-circle"></i> Add Opportunity 
                            </button>
                        </div>                        
                        <button class="export" onclick="javascript:window.print();">Print</button>  
                    </div>
                    <div class="space15"></div>
                    <table class="table table-striped table-hover table-bordered" id="">
                        <thead>
                            <tr>
                                <th>#</th>                        
                                <th>Opportunity</th>
                                <th>Note</th>
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
                        <?php
                        $i = 0;
                        foreach ($snws as $snw) {
                            if ($snw->type == '3') {
                                $i = $i + 1;
                                ?>
                                <tr class="">
                                    <td> <?php echo $i; ?></td>
                                    <td><?php echo $snw->topic; ?></td>
                                    <td> <?php echo $snw->note; ?></td>
                                    <td>
                                        <button type="button" class="btn btn-info btn-xs btn_width editbutton" data-toggle="modal" data-id="<?php echo $snw->id; ?>"><i class="fa fa-edit"></i></button>
                                        <a class="btn btn-info btn-xs btn_width delete_button" href="snw/delete?id=<?php echo $snw->id; ?>" onclick="return confirm('Are you sure you want to delete this item?');"><i class="fa fa-trash-o"></i></a>
                                    </td>
                                </tr>
                                <?php
                            }
                        }
                        ?>
                        </tbody>
                    </table>
                </div>
                <div class="col-md-1"></div>
                <div class="adv-table editable-table col-md-5 padding" style="background: #f1f1f1;">
                    <div class="clearfix btn_margin">
                        <div class="btn-group">
                            <button id="" class="btn green addbutton" data-toggle="modal" href="#myModal" data-id="4">
                                <i class="fa fa-plus-circle"></i>  Add Threat 
                            </button>
                        </div>                        
                        <button class="export" onclick="javascript:window.print();">Print</button>  
                    </div>
                    <div class="space15"></div>
                    <table class="table table-striped table-hover table-bordered" id="">
                        <thead>
                            <tr>
                                <th>#</th>                        
                                <th>Threat</th>
                                <th>Note</th>
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
                        <?php
                        $i = 0;
                        foreach ($snws as $snw) {
                            if ($snw->type == '4') {
                                $i = $i + 1;
                                ?>
                                <tr class="">
                                    <td> <?php echo $i; ?></td>
                                    <td><?php echo $snw->topic; ?></td>
                                    <td> <?php echo $snw->note; ?></td>
                                    <td>                                   
                                        <button type="button" class="btn btn-info btn-xs btn_width editbutton" data-toggle="modal" data-id="<?php echo $snw->id; ?>"><i class="fa fa-edit"></i></button>
                                        <a class="btn btn-info btn-xs btn_width delete_button" href="snw/delete?id=<?php echo $snw->id; ?>" onclick="return confirm('Are you sure you want to delete this item?');"><i class="fa fa-trash-o"></i></a>
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
<!--footer start-->

<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="display: none;">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h4 class="modal-title"><i class="fa fa-plus-circle"></i> Add Analysis</h4>
            </div>
            <div class="modal-body">
                <form role="form" id="snwAddForm" action="snw/addNew" method="post" enctype="multipart/form-data">
                    <input type="hidden" name="type" value=''>
                    <div class="form-group">
                        <label for="exampleInputEmail1">Topic</label>
                        <input type="text" class="form-control" name="topic" id="exampleInputEmail1" value='' placeholder="">
                    </div>
                    <div class="form-group">
                        <label for="exampleInputEmail1">Note</label>
                        <input type="text" class="form-control" name="note" id="exampleInputEmail1" value='' placeholder="">
                    </div>
                    <input type="hidden" name="id" value=''>
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
                <h4 class="modal-title"><i class="fa fa-edit"></i> Edit Analysis</h4>
            </div>
            <div class="modal-body">
                <form role="form" id="snwEditForm" action="snw/addNew" method="post" enctype="multipart/form-data">
                    <div class="form-group">
                        <label for="exampleInputEmail1">Topic</label>
                        <input type="text" class="form-control" name="topic" id="exampleInputEmail1" value='' placeholder="">
                    </div>
                    <div class="form-group">
                        <label for="exampleInputEmail1">Note</label>
                        <input type="text" class="form-control" name="note" id="exampleInputEmail1" value='' placeholder="">
                    </div>
                    <input type="hidden" name="type" value=''>
                    <input type="hidden" name="id" value=''>
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
                                        $(".addbutton").click(function (e) {
                                            e.preventDefault(e);
                                            // Get the record's ID via attribute  
                                            var type = $(this).attr('data-id');
                                            $('#snwAddForm').find('[name="type"]').val(+type).end()
                                            $('#myModal').modal('show');
                                        });
                                    });
</script>

<script type="text/javascript">
    $(document).ready(function () {
        $(".editbutton").click(function (e) {
            e.preventDefault(e);
            // Get the record's ID via attribute  
            var iid = $(this).attr('data-id');
            $('#snwEditForm').trigger("reset");
            $('#myModal2').modal('show');
            $.ajax({
                url: 'snw/editSnwByJason?id=' + iid,
                method: 'GET',
                data: '',
                dataType: 'json',
            }).success(function (response) {
                // Populate the form fields with the data returned from server
                $('#snwEditForm').find('[name="id"]').val(response.snw.id).end()
                $('#snwEditForm').find('[name="type"]').val(response.snw.type).end()
                $('#snwEditForm').find('[name="topic"]').val(response.snw.topic).end()
                $('#snwEditForm').find('[name="note"]').val(response.snw.note).end()
            });
        });
    });
</script>
<script>
    $(document).ready(function () {
        $(".flashmessage").delay(3000).fadeOut(100);
    });
</script>
