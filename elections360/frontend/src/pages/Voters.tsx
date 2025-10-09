import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import Button from '../components/ui/Button';

const Voters = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">إدارة الناخبين</h2>
      <Button>إضافة ناخب</Button>
    </div>
    <Card>
      <Table headers={['الاسم', 'الرقم الوطني', 'الدائرة']}>
        <tr>
          <td className="px-4 py-3">سارة الخطيب</td>
          <td className="px-4 py-3">123456789</td>
          <td className="px-4 py-3">الدائرة الأولى</td>
        </tr>
        <tr>
          <td className="px-4 py-3">محمد علي</td>
          <td className="px-4 py-3">987654321</td>
          <td className="px-4 py-3">الدائرة الثالثة</td>
        </tr>
      </Table>
    </Card>
  </div>
);

export default Voters;
