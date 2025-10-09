import Card from '../components/ui/Card';
import Table from '../components/ui/Table';

const Activities = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">النشاط الميداني</h2>
    <Card>
      <Table headers={['الفريق', 'النشاط', 'الوقت']}>
        <tr>
          <td className="px-4 py-3">الفريق الشمالي</td>
          <td className="px-4 py-3">توزيع مواد توعوية</td>
          <td className="px-4 py-3">08:30</td>
        </tr>
        <tr>
          <td className="px-4 py-3">فريق المتابعة</td>
          <td className="px-4 py-3">زيارة لجنة ثانوية 4</td>
          <td className="px-4 py-3">09:15</td>
        </tr>
      </Table>
    </Card>
  </div>
);

export default Activities;
