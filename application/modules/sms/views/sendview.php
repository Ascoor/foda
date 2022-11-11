<!--sidebar end-->
<!--main content start-->
<section id="main-content">
    <section class="wrapper site-min-height">
        <!-- page start-->
        <div class="col-md-12">
            <section class="panel">
                <header class="panel-heading">
                    <i class="fa fa-location-arrow"></i> Send Sms
                </header>
                <div class="panel-body">  
                    <div class="col-lg-12">
                        <a href="sms/sent" class='pull-right'>
                            <button class="btn green">
                                List Of Sent Messages
                            </button>
                        </a> 
                        <section class="panel">
                            <div class="panel-body">         
                                <form role="form" action="sms/send" method="post">
                                    <div class="col-md-3"> 
                                        <div class="radio">
                                            <label>         
                                                Send SMS To
                                            </label>    
                                        </div>
                                    </div>
                                    <div class="col-md-7">
                                        <div class="radio">
                                            <label>
                                                <input type="radio" name="radio" id="optionsRadios1" value="allvoter">
                                                All Voter
                                            </label>
                                        </div>
                                        <div class="radio">
                                            <label>
                                                <input type="radio" name="radio" id="optionsRadios2" value="allvolunteer">
                                                All Volunteer
                                            </label>
                                        </div>
                                    </div>
                                    <div class="form-group col-md-12">
                                        <label class="control-label col-md-3">Message</label>
                                        <div class="col-md-9">
                                            <textarea class="ckeditor" name="message" value="" cols="70" rows="10"></textarea>
                                        </div>
                                    </div>
                                    <input type="hidden" name="id" value=''>
                                    <button type="submit" name="submit" class="btn btn-info"><i class="fa fa-location-arrow"></i> Send SMS</button>
                                </form>
                            </div>
                        </section>
                    </div>
                </div>
            </section>
        </div>
        <!-- page end-->
    </section>
</section>
<!--main content end-->
<!--footer start-->








<div class="modal fade" id="myModal1" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="display: none;">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h4 class="modal-title">Send SMS To All Voter</h4>
            </div>
            <div class="modal-body">
                <form role="form" action="sms/sendVoter" method="post" enctype="multipart/form-data">
                    <div class="form-group">
                        <label for="exampleInputEmail1">Message</label>
                        <textarea cols="50" rows="10" class="form-control" name="message" id="exampleInputEmail1" value=''> </textarea>
                    </div>
                    <button type="submit" name="submit" class="btn btn-info submit_button">Submit</button>
                </form>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div>


<div class="modal fade" id="myModal2" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="display: none;">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h4 class="modal-title">Send SMS To Voters</h4>
            </div>
            <div class="modal-body">
                <form role="form" action="sms/sendVoterAreaWise" method="post" enctype="multipart/form-data">
                    <div class="form-group">
                        <label for="exampleInputEmail1">Message</label>
                        <textarea cols="50" rows="10" class="form-control" name="message" id="exampleInputEmail1" value=''> </textarea>
                    </div>
                    <input type="hidden" id="area_id" value="" name="area_id">
                    <button type="submit" name="submit" class="btn btn-info submit_button">Submit</button>
                </form>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div>


<div class="modal fade" id="myModal3" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="display: none;">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h4 class="modal-title">Send SMS To All Volunteer</h4>
            </div>
            <div class="modal-body">
                <form role="form" action="sms/sendVolunteer" method="post" enctype="multipart/form-data">
                    <div class="form-group">
                        <label for="exampleInputEmail1">Message</label>
                        <textarea cols="50" rows="10" class="form-control" name="message" id="exampleInputEmail1" value=''> </textarea>
                    </div>
                    <button type="submit" name="submit" class="btn btn-info submit_button">Submit</button>
                </form>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div>







<div class="modal fade" id="myModal4" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="display: none;">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h4 class="modal-title">Send SMS To Volunteers</h4>
            </div>
            <div class="modal-body">
                <form role="form" action="sms/sendVolunteerAreaWise" method="post" enctype="multipart/form-data">
                    <div class="form-group">
                        <label for="exampleInputEmail1">Message</label>
                        <textarea cols="50" rows="10" class="form-control" name="message" id="exampleInputEmail1" value=''> </textarea>
                    </div>
                    <input type="hidden" id="area_idd" value="" name="area_id">
                    <button type="submit" name="submit" class="btn btn-info submit_button">Submit</button>
                </form>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div>

<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script type="text/javascript">


    $(document).ready(function () {
        $(".voterAW").click(function () {
            $("#area_id").val($(this).attr('data-id'));
            $('#myModal2').modal('show');
        });
        $(".volunteerAW").click(function () {
            $("#area_idd").val($(this).attr('data-id'));
            $('#myModal4').modal('show');
        });
    });

</script>

<script>
    $(document).ready(function () {
        $(".flashmessage").delay(3000).fadeOut(100);
    });
</script>