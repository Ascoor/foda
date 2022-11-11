<!--sidebar end-->
<!--main content start-->
<section id="main-content">
    <section class="wrapper site-min-height">
        <!--state overview start-->
        <div class="row state-overview">
            <div class="col-lg-3 col-sm-6">
                <?php if ($this->ion_auth->in_group('admin')) { ?>
                    <a href="voter">
                    <?php } ?>
                    <section class="panel">
                        <div class="dash-heading">
                            Voter
                        </div>
                        <div class="value">
                            <h1 class="">
                                <?php echo $this->db->count_all('voter'); ?>
                            </h1>
                            <p>Voter</p>
                        </div>
                    </section>
                    <?php if ($this->ion_auth->in_group('admin')) { ?>
                    </a>
                <?php } ?>
            </div>
            <div class="col-lg-3 col-sm-6">
                <?php if ($this->ion_auth->in_group('admin')) { ?>
                    <a href="volunteer">
                    <?php } ?>
                    <section class="panel">
                        <div class="dash-heading">
                            Volunteer
                        </div>
                        <div class="value"> 
                            <h1 class="">
                                <?php echo $this->db->count_all('volunteer'); ?>
                            </h1>
                            <p>Volunteer</p>
                        </div>
                    </section>
                    <?php if (!$this->ion_auth->in_group('admin')) { ?>
                    </a>
                <?php } ?>
            </div>
            <div class="col-lg-3 col-sm-6">
                <?php if ($this->ion_auth->in_group('admin')) { ?>
                    <a href="event">
                    <?php } ?>
                    <section class="panel">
                        <div class="dash-heading">
                            Event
                        </div>
                        <div class="value">
                            <h1 class="">
                                <?php
                                $event_dates = $this->db->get('event')->result();
                                $i = 0;
                                foreach ($event_dates as $event_date) {
                                    if (strtotime($event_date->date) > time()) {
                                        $i = $i + 1;
                                    }
                                }
                                echo $i;
                                ?>
                            </h1>
                            <p>Upcoming Events</p>
                        </div>
                    </section>
                    <?php if ($this->ion_auth->in_group('admin')) { ?>
                    </a>
                <?php } ?>
            </div>

            <div class="col-lg-3 col-sm-6">
                <?php if ($this->ion_auth->in_group('admin')) { ?>
                    <a href="area">
                    <?php } ?>
                    <section class="panel">
                        <div class="dash-heading">
                            Areas
                        </div>
                        <div class="value">
                            <h1 class="">
                                <?php echo $this->db->count_all('area'); ?>
                            </h1>
                            <p>Areas</p>
                        </div>
                    </section>
                    <?php if ($this->ion_auth->in_group('admin')) { ?>
                    </a>
                <?php } ?>
            </div>

            <div class="col-md-12">
                <section class="panel">
                </section>
            </div>

            <div class="col-lg-3 col-sm-6">
                <?php if ($this->ion_auth->in_group('admin')) { ?>
                    <a href="sms/sendView">
                    <?php } ?>
                    <section class="panel">
                        <div class="dash-heading">
                            Bulk SMS
                        </div>
                        <div class="value">
                            <h1> <i class="fa fa-location-arrow"></i> </h1>
                            <p> Send SMS To Voter/Volunteer</p>
                        </div>
                    </section>
                    <?php if ($this->ion_auth->in_group('admin')) { ?>
                    </a>
                <?php } ?>
            </div>
            <div class="col-lg-3 col-sm-6">
                <?php if ($this->ion_auth->in_group('admin')) { ?>
                    <a href="snw">
                    <?php } ?>
                    <section class="panel">
                        <div class="dash-heading">
                            Analysis
                        </div>
                        <div class="value">
                            <h1> <i class="fa fa-archive"></i> </h1>
                            <p>Campaign Analysys</p>
                        </div>
                    </section>
                    <?php if ($this->ion_auth->in_group('admin')) { ?>
                    </a>
                <?php } ?>
            </div>
            <div class="col-lg-3 col-sm-6">
                <?php if ($this->ion_auth->in_group('admin')) { ?>
                    <a href="finance/expense">
                    <?php } ?>
                    <section class="panel">
                        <div class="dash-heading">
                            Expense
                        </div>
                        <div class="value">
                            <h1> <i class="fa fa-money"></i> </h1>
                            <p>Expense report</p>
                        </div>
                    </section>
                    <?php if ($this->ion_auth->in_group('admin')) { ?>
                    </a>
                <?php } ?>
            </div>
            <div class="col-lg-3 col-sm-6">
                <?php if ($this->ion_auth->in_group('admin')) { ?>
                    <a href="settings">
                    <?php } ?>
                    <section class="panel">
                        <div class="dash-heading">
                            Settings
                        </div>
                        <div class="value">
                            <h1> <i class="fa fa-gears"></i> </h1>
                            <p>Settings</p>
                        </div>
                    </section>
                    <?php if ($this->ion_auth->in_group('admin')) { ?>
                    </a>
                <?php } ?>
            </div>
        </div>
        <div class="col-md-12">
            <section class="panel"> 
            </section>
        </div> 
        <div class="col-md-12 home_calender">
            <?php echo $this->calendar->generate(); ?>
        </div>
        <!--state overview end-->
    </section>
</section>
<!--main content end-->
<!--footer start-->

<!--footer end-->
</section>

<!-- js placed at the end of the document so the pages load faster -->

<script src="common/js/jquery.sparkline.js" type="text/javascript"></script>
<script src="common/assets/jquery-easy-pie-chart/jquery.easy-pie-chart.js"></script>
<script src="common/js/owl.carousel.js" ></script>
<script src="common/js/jquery.customSelect.min.js" ></script>
<script src="common/js/respond.min.js" ></script>

<!--common script for all pages-->
<script src="common/js/common-scripts.js"></script>

<!--script for this page-->
<script src="common/js/sparkline-chart.js"></script>
<script src="common/js/easy-pie-chart.js"></script>
<script src="common/js/count.js"></script>

<script>

    //owl carousel

    $(document).ready(function () {
        $("#owl-demo").owlCarousel({
            navigation: true,
            slideSpeed: 300,
            paginationSpeed: 400,
            singleItem: true,
            autoPlay: true

        });
    });

    //custom select box

    $(function () {
        $('select.styled').customSelect();
    });

</script>
</body>
</html>
