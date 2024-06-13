import { Button } from '@/components/ui/button';
import { db } from 'configs';
import { userResponses } from 'configs/schema';
import { eq, count } from 'drizzle-orm';
import { Loader2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

function FormListItemResponse({ jsonForm, formRecord }) {
  const [loading, setLoading] = useState(false);
  const [responseCount, setResponseCount] = useState(0);

  useEffect(() => {
    getResponseCount();
  }, [formRecord.id]);

  const getResponseCount = async () => {
    try {
      const result = await db
        .select({ count: count(userResponses.formref) })
        .from(userResponses)
        .where(eq(userResponses.formref, formRecord.id))
        .execute();

      if (result && result.length > 0) {
        setResponseCount(result[0].count);
      }
    } catch (error) {
      console.error('Error fetching response count:', error);
    }
  };

  const ExportData = async () => {
    let jsonData = [];

    setLoading(true);
    console.log('Form Record ID:', formRecord.id);

    try {
      const result = await db
        .select()
        .from(userResponses)
        .where(eq(userResponses.formref, formRecord.id))
        .execute();

      console.log('Query Result:', result);

      if (result) {
        result.forEach((item) => {
          const jsonItem = JSON.parse(item.jsonResponse);
          jsonData.push(jsonItem);
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }

    console.log(jsonData);
    exportToExcel(jsonData);
  };

  const exportToExcel = (jsonData) => {
    const worksheet = XLSX.utils.json_to_sheet(jsonData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, jsonForm?.formTitle + '.xlsx');
  };

  return (
    <div className='border shadow-sm rounded-lg p-4 my-5'>
      <h2 className='text-lg text-white'>{jsonForm?.formTitle}</h2>
      <h2 className='text-sm text-gray-500'>{jsonForm?.formHeading}</h2>
      <hr className='my-4  border-gray-600'></hr>
      <div className='flex justify-between items-center'>
        <h2 className='text-sm text-white'>
          <strong>{responseCount}</strong> Responses
        </h2>
        <Button className='' size='sm' onClick={ExportData} disabled={loading}>
          {loading ? <Loader2 className='animate-spin' /> : 'Export'}
        </Button>
      </div>
    </div>
  );
}

export default FormListItemResponse;
