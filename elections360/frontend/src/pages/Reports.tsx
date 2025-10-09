import Card from '../components/ui/Card';
import Table from '../components/ui/Table';

const Reports = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">التقارير المباشرة</h2>
    <Card>
      <Table headers={['النوع', 'الوصف', 'آخر تحديث']}>
        <tr>
          <td className="px-4 py-3">أمني</td>
          <td className="px-4 py-3">ازدحام أمام لجنة رئيسية 2</td>
          <td className="px-4 py-3">قبل 3 دقائق</td>
        </tr>
        <tr>
          <td className="px-4 py-3">تشغيلي</td>
          <td className="px-4 py-3">نقص في أوراق الاقتراع لجنة 8</td>
          <td className="px-4 py-3">قبل 7 دقائق</td>
        </tr>
      </Table>
    </Card>
  </div>
);

export default Reports;
