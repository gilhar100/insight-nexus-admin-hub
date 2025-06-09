
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

interface OpportunityZoneSectionProps {
  isPresenterMode: boolean;
}

export const OpportunityZoneSection: React.FC<OpportunityZoneSectionProps> = ({
  isPresenterMode
}) => {
  return (
    <div className={`${isPresenterMode ? 'mt-16' : 'mt-12'}`}>
      <Card className={`${isPresenterMode ? 'border-2 border-green-200 bg-green-50' : 'bg-green-50'}`}>
        <CardContent className={isPresenterMode ? 'p-8' : 'p-6'}>
          <div className={`text-center ${isPresenterMode ? 'space-y-6' : 'space-y-4'}`}>
            <h3 className={`${isPresenterMode ? 'text-2xl' : 'text-lg'} font-bold mb-4 text-green-800 flex items-center justify-center`}>
              <Lightbulb className="h-6 w-6 ml-2" />
              מדוע כדאי לנוע לאזור ההזדמנות
            </h3>
            <div className={`${isPresenterMode ? 'text-lg' : 'text-base'} leading-relaxed text-green-700 text-right px-4`}>
              <p className="mb-4">
                <strong>מדוע אזור ההזדמנות הוא אידיאלי?</strong>
              </p>
              <p className="leading-relaxed">
                אזור ההזדמנות מייצג איזון נדיר בין יוזמה לאחריות, בין יצירתיות לבקרה, ובין הישגיות לשיתוף פעולה.
                זהו המרחב שבו הארגון מסוגל ליזום שינוי, לנהל קונפליקטים באופן בונה, ולנוע לעבר עתיד משמעותי ובר־קיימא.
                תרבות ארגונית המתבססת על ערכים אלו אינה רק אפקטיבית יותר – היא גם עמידה, חדשנית ובעלת השפעה חיובית על עובדיה ועל סביבתה.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
