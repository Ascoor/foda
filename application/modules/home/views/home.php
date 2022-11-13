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
                            الناخبين
                        </div>
                        <div class="value">
                            <h1 class="">
                                <?php echo $this->db->count_all('voter'); ?>
                            </h1>
                            <p>الناخبين</p>
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
                            الوكلاء
                        </div>
                        <div class="value"> 
                            <h1 class="">
                                <?php echo $this->db->count_all('volunteer'); ?>
                            </h1>
                            <p>الوكلاء</p>
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
                            الحدث
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
                            <p>إجمالي الأحداث</p>
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
                            اللجان والمناطق
                        </div>
                        <div class="value">
                            <h1 class="">
                                <?php echo $this->db->count_all('area'); ?>
                            </h1>
                            <p>المناطق</p>
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
                            الرسائل النصية
                        </div>
                        <div class="value">
                            <h1> <i class="fa fa-location-arrow"></i> </h1>
                            <p>إرسال رسائل للوكلاء أو الناخبين</p>
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
                            التقييم
                        </div>
                        <div class="value">
                            <h1> <i class="fa fa-archive"></i> </h1>
                            <p>تقييم الحملة</p>
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
                            التكاليف
                        </div>
                        <div class="value">
                            <h1> <i class="fa fa-money"></i> </h1>
                            <p>تقرير التكاليف</p>
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
                            الإعدادات
                        </div>
                        <div class="value">
                            <h1> <i class="fa fa-gears"></i> </h1>
                            <p>الإعدادات</p>
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
