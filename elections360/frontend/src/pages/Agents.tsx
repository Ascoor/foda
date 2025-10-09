import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import Button from '../components/ui/Button';

const Agents = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">المندوبون</h2>
      <Button>دعوة مندوب</Button>
    </div>
    <Card>
      <Table headers={['الاسم', 'اللجنة', 'الحالة']}>
        <tr>
          <td className="px-4 py-3">ليث الزعبي</td>
          <td className="px-4 py-3">لجنة ثانوية 4</td>
          <td className="px-4 py-3">نشط</td>
        </tr>
        <tr>
          <td className="px-4 py-3">ريم العتيبي</td>
          <td className="px-4 py-3">لجنة رئيسية 2</td>
          <td className="px-4 py-3">غير متصل</td>
        </tr>
      </Table>
    </Card>
  </div>
);

export default Agents;
