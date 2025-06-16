
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Lightbulb, X } from 'lucide-react';

interface OpportunityZoneSectionProps {
  isPresenterMode: boolean;
}

export const OpportunityZoneSection: React.FC<OpportunityZoneSectionProps> = ({
  isPresenterMode
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const firstLine = "מהו אזור ההזדמנות ומדוע נרצה לנוע אליו?";
  
  const fullContent = `אזור ההזדמנות הוא מצב תודעתי ארגוני שבו מתקיימים סקרנות מתמדת, פתיחות לשינויים, ולמידה מתמשכת. זהו אזור המאופיין בהקשבה עמוקה לאחר, טיפוח מערכות יחסים בינאישיות, וחתירה לחדשנות מתוך משמעות.

רק ארגון שפועל מתוך אזור ההזדמנות מסוגל לגבש חזון בהיר ומעורר השראה, ללמוד מכישלונות, לזהות הזדמנויות נסתרות – ולעיתים אף לגלות את "האוקיינוסים הכחולים".

"מנהיגים טרנספורמטיביים מטיבים לספר את 'הנרטיב' – את הסיפור של השינוי שיחולל החזון. שינוי שנוגע בכל המונהגים וגורם להם להרגיש שיש כאן הזדמנות לעצמם ולארגון, רותם אותם ומעלה את הביצועים מעבר לצפוי." – ד"ר יוסי שרעבי`;

  return (
    <div className={`${isPresenterMode ? 'mt-16' : 'mt-12'}`}>
      <Card className={`${isPresenterMode ? 'border-2 border-green-200 bg-green-50' : 'bg-green-50'}`}>
        <CardContent className={isPresenterMode ? 'p-8' : 'p-6'}>
          <div className={`text-center ${isPresenterMode ? 'space-y-6' : 'space-y-4'}`}>
            <div className={`${isPresenterMode ? 'text-lg' : 'text-base'} leading-relaxed text-green-700 text-right px-4`}>
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <div className="cursor-pointer hover:bg-green-100 p-4 rounded-lg transition-colors">
                    <div className="flex items-center justify-center mb-4">
                      <Lightbulb className="h-6 w-6 ml-2" />
                      <h3 className={`${isPresenterMode ? 'text-2xl' : 'text-lg'} font-bold text-green-800`}>
                        {firstLine}
                      </h3>
                    </div>
                    <p className="text-sm text-green-600">לחץ לקריאה מלאה</p>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto" dir="rtl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-green-800 text-right flex items-center justify-center">
                      <Lightbulb className="h-6 w-6 ml-2" />
                      {firstLine}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="mt-6 text-lg leading-relaxed text-green-700 text-right whitespace-pre-line">
                    {fullContent}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
