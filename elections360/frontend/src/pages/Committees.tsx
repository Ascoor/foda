import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import Button from '../components/ui/Button';

const Committees = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">اللجان الانتخابية</h2>
      <Button>إضافة لجنة</Button>
    </div>
    <Card>
      <Table headers={['اسم اللجنة', 'الموقع', 'عدد الناخبين']}>
        <tr>
          <td className="px-4 py-3">لجنة ثانوية 4</td>
          <td className="px-4 py-3">المنطقة الشرقية</td>
          <td className="px-4 py-3">530</td>
        </tr>
        <tr>
          <td className="px-4 py-3">لجنة رئيسية 2</td>
          <td className="px-4 py-3">وسط المدينة</td>
          <td className="px-4 py-3">890</td>
        </tr>
      </Table>
    </Card>
  </div>
);

export default Committees;
