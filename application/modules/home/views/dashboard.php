<!DOCTYPE html>
<html lang="ar" dir="rtl">
    <head>
        <base href="<?php echo base_url(); ?>">
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="">
        <meta name="author" content="Rizvi">
        <meta name="keyword" content="Php, Election, Voting, Election Management, Software, Php, CodeIgniter, Ecms, Election Campaign">
        <link rel="shortcut icon" href="uploads/favicon.png">
        <title><?php echo $this->router->fetch_class(); ?> | Election Campaign Management System</title>
        <!-- Bootstrap core CSS -->
        <link href="common/css/bootstrap.min.css" rel="stylesheet">
        <link href="common/css/bootstrap-reset.css" rel="stylesheet">   
        <!--external css-->
        <link href="common/assets/font-awesome/css/font-awesome.css" rel="stylesheet" />
        <link rel="stylesheet" href="common/assets/data-tables/DT_bootstrap.css" />
        <!-- Custom styles for this template -->
        <link href="common/css/style.css" rel="stylesheet">
        <link href="common/css/style-responsive.css" rel="stylesheet" />
        <link rel="stylesheet" href="common/assets/bootstrap-datepicker/css/datepicker.css" />
        <link rel="stylesheet" type="text/css" href="common/assets/bootstrap-daterangepicker/daterangepicker-bs3.css" />
        <link rel="stylesheet" type="text/css" href="common/assets/bootstrap-datetimepicker/css/datetimepicker.css" />
        <link href="common/css/invoice-print.css" rel="stylesheet" media="print">
        <link rel="stylesheet" type="text/css" href="common/assets/jquery-multi-select/css/multi-select.css">
        <!-- HTML5 shim and Respond.js IE8 support of HTML5 tooltipss and media queries -->
        <!--[if lt IE 9]>
          <script src="js/html5shiv.js"></script>
          <script src="js/respond.min.js"></script>
        <![endif]-->
    </head>

    <body>
        <section id="container" class="">
            <!--header start-->
            <header class="header white-bg">
                <div class="col-md-2 logo_bac">
                    <div class="sidebar-toggle-box">
                        <div data-original-title="Toggle Navigation" data-placement="right" class="fa fa-bars tooltips"></div>
                    </div>
                    <!--logo start-->
                    <a href="" class="logo bold">F O D A<span> </span>2025</a>
                    <!--logo end-->
                </div>
                <div class="nav notify-row" id="top_menu">
                    <!--  notification start -->
                    <ul class="nav top-menu">
                    </ul>
                </div>
                <div class="top-nav ">
                    <?php
                    $message = $this->session->flashdata('feedback');
                    if (!empty($message)) {
                        ?>
                        <div class="flashmessage pull-left"><i class="fa fa-check"></i> <?php echo $message; ?></div>
                    <?php } ?> 
                    <ul class="nav pull-right top-menu">
                    </ul>
                    <div class=" col-md-3 pull-right padding_allright">
                        <a href="settings" class="allright"> <i class="fa fa-cog"></i> الإعدادات</a>
                        <a href="profile" class="allright"> <i class=" fa fa-suitcase"></i> الملف الشخصي</a>
                        <a href="auth/logout" class="allright"> <i class="fa fa-key"></i> تسجيل الخروج</a>
                    </div>
                </div>
            </header>
            <!--header end-->
            <!--sidebar start-->
            <aside>
                <div id="sidebar"  class="nav-collapse ">
                    <!-- sidebar menu start-->
                    <ul class="sidebar-menu" id="nav-accordion">
                        <li>
                            <a href="">
                                <i class="fa fa-dashboard"></i>
                                <span>لوحة التحكم</span>
                            </a>
                        </li>
                        <?php if ($this->ion_auth->in_group('admin')) { ?>
                            <li>
                                <a href="area">
                                    <i class="fa fa-home"></i>
                                    <span>قائمة المناطق</span>
                                </a>
                            </li>
                            <li>
                                <a href="volunteer" >
                                    <i class="fa fa-users"></i>
                                    <span>إدارة الوكلاء</span>
                                </a>
                            </li>
                            <li>
                                <a href="voter" >
                                    <i class="fa fa-user"></i>
                                    <span>قاعدة بيانات الناخبين</span>
                                </a>
                            </li>
                            <li class="sub-menu">
                                <a href="javascript:;" >
                                    <i class="fa  fa-users"></i>
                                    <span>الفريق</span>
                                </a>
                                <ul class="sub">
                                    <li><a  href="team"><i class="fa fa-users"></i>جميع الفرق </a></li>
                                    <li><a  href="team/addNewView"><i class="fa fa-plus"></i>إضافة فريق</a></li>
                                </ul>
                            </li>
                            <li>
                                <a href="event" >
                                    <i class="fa fa-hand-o-up"></i>
                                    <span>الحدث</span>
                                </a>
                            </li>
                            <li>
                                <a href="snw" >
                                    <i class="fa fa-strikethrough"></i>
                                    <span>تقييم الحملة</span>
                                </a>
                            </li>
                            <li class="sub-menu">
                                <a href="javascript:;" >
                                    <i class="fa  fa-money"></i>
                                    <span>التكاليف</span>
                                </a>
                                <ul class="sub">
                                    <li><a  href="finance/expense"><i class="fa fa-money"></i>المصروفات</a></li>
                                    <li><a  href="finance/addExpenseView"><i class="fa fa-plus"></i>إضافة مصروف</a></li>
                                    <li><a  href="finance/expenseCategory"><i class="fa fa-credit-card"></i>فئات المصروفات</a></li>
                                    <li><a  href="finance/addExpenseCategory"><i class="fa fa-plus"></i>إضافة فئة مصروف</a></li>
                                    <li><a  href="finance/financialReport"><i class="fa fa-money"></i>تقرير المصروفات</a></li>
                                </ul>
                            </li>
                            <li class="sub-menu">
                                <a href="javascript:;" >
                                    <i class="fa fa-envelope-o"></i>
                                    <span>الرسائل النصية</span>
                                </a>
                                <ul class="sub">
                                    <li><a  href="sms/sendView"><i class="fa fa-location-arrow"></i>إرسال رسالة</a></li>
                                    <li><a  href="sms/settings"><i class="fa fa-gear"></i>إعدادات الرسائل</a></li>
                                </ul>
                            </li>  
                            <li>
                                <a href="settings" >
                                    <i class="fa fa-gears"></i>
                                    <span> الإعدادات </span>
                                </a>
                            </li>

                            <li>
                                <a href="profile" >
                                    <i class="fa fa-user"></i>
                                    <span> الملف الشخصي </span>
                                </a>
                            </li>
                        <?php } ?>
                    </ul>
                    <!-- sidebar menu end-->
                </div>
            </aside>
            <!--sidebar end-->




