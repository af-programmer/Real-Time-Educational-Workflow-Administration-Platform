import PrintRequestForm from '../../components/print/PrintRequestForm';

export default function NewPrintRequest() {
  return (
    <div className="max-w-2xl">
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Submit New Print Request</h2>
        <PrintRequestForm />
      </div>
    </div>
  );
}
