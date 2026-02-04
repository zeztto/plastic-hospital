import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { faqs } from '@/data/content'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export function FAQ() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section id="faq" className="py-16 lg:py-24 bg-gradient-to-b from-white to-muted/30 relative overflow-hidden">
      <div className="absolute top-1/2 -translate-y-1/2 right-8 text-[180px] font-bold text-primary/[0.03] leading-none select-none pointer-events-none hidden lg:block">
        FAQ
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-primary font-medium mb-2 text-sm tracking-widest uppercase">FAQ</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            자주 묻는 질문
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            궁금하신 점이 있으시면<br />
            언제든지 문의해주세요.
          </p>
        </div>

        <div 
          ref={ref}
          className={`max-w-3xl mx-auto transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-white rounded-lg border border-border px-6 data-[state=open]:border-primary/30 data-[state=open]:shadow-sm transition-all"
              >
                <AccordionTrigger className="text-left hover:text-primary hover:no-underline py-5">
                  <span className="font-medium">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 border-t border-border/50 pt-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
