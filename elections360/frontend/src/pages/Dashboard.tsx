import Card from '../components/ui/Card';
import Table from '../components/ui/Table';

const Dashboard = () => (
  <div className="space-y-6">
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      <Card title="إجمالي الناخبين" subtitle="آخر تحديث قبل دقيقة">
        <p className="text-3xl font-bold">12,584</p>
      </Card>
      <Card title="المندوبون النشطون" subtitle="متصلون الآن">
        <p className="text-3xl font-bold text-primary">142</p>
      </Card>
      <Card title="اللجان" subtitle="جاهزة للتشغيل">
        <p className="text-3xl font-bold">36</p>
      </Card>
    </div>

    <Card title="آخر التقارير">
      <Table headers={['التقرير', 'المنطقة', 'الحالة']}>
        <tr>
          <td className="px-4 py-3">تقرير لجنة 12</td>
          <td className="px-4 py-3">وسط المدينة</td>
          <td className="px-4 py-3">مكتمل</td>
        </tr>
        <tr>
          <td className="px-4 py-3">تقرير طوارئ</td>
          <td className="px-4 py-3">شمال العاصمة</td>
          <td className="px-4 py-3">قيد المراجعة</td>
        </tr>
      </Table>
    </Card>
  </div>
);

export default Dashboard;
