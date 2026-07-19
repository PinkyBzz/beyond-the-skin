'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, Loader2 } from 'lucide-react'
import { storyFormSchema, type StoryFormSchema } from '@/lib/validations'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import type { StoryCategory } from '@/types'

interface StoryFormProps {
  categories: StoryCategory[]
}

const STEPS = [
  { id: 1, label: 'About You', description: 'Tell us a little about yourself' },
  { id: 2, label: 'Your Story', description: 'Share your experience' },
  { id: 3, label: 'Reflection', description: 'What did you learn?' },
  { id: 4, label: 'Changemaker', description: 'Who inspired you?' },
  { id: 5, label: 'Submit', description: 'Review & consent' },
]

export function StoryForm({ categories }: StoryFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<StoryFormSchema>({
    resolver: zodResolver(storyFormSchema),
    // Note: publish_consent and privacy_agreement start unchecked
    // The Zod schema requires literal true, so we cast defaults
    defaultValues: {} as Partial<StoryFormSchema>,
  })

  const watchConsent = watch('publish_consent')
  const watchPrivacy = watch('privacy_agreement')
  const watchCategory = watch('category_id')

  const stepFields: Record<number, (keyof StoryFormSchema)[]> = {
    1: ['full_name', 'age', 'school', 'phone_number', 'category_id'],
    2: ['title', 'content'],
    3: ['reflection'],
    4: ['changemaker_name', 'changemaker_reason'],
    5: ['publish_consent', 'privacy_agreement'],
  }

  const handleNext = async () => {
    const fields = stepFields[currentStep]
    if (!fields) return
    const valid = await trigger(fields as (keyof StoryFormSchema)[])
    if (valid) setCurrentStep((s) => Math.min(s + 1, STEPS.length))
  }

  const handleBack = () => setCurrentStep((s) => Math.max(s - 1, 1))

  const onSubmit = async (data: StoryFormSchema) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error ?? 'Something went wrong')
      }

      router.push('/share/thank-you')
    } catch (err) {
      toast({
        variant: 'error',
        title: 'Submission failed',
        description: err instanceof Error ? err.message : 'Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="rounded-3xl bg-white border border-[#FFB6D6]/20 shadow-sm overflow-hidden">
      {/* Progress bar */}
      <div className="bg-[#FFE9F1]/50 p-6 pb-0">
        <div className="flex items-center justify-between mb-4">
          {STEPS.map((step) => (
            <div
              key={step.id}
              className="flex flex-col items-center gap-1"
              aria-current={currentStep === step.id ? 'step' : undefined}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                  currentStep > step.id
                    ? 'bg-[#C6F4E9] text-green-700'
                    : currentStep === step.id
                    ? 'bg-[#FFB6D6] text-white shadow-md'
                    : 'bg-[#FFE9F1] text-[#3A3A3A]/40'
                }`}
              >
                {currentStep > step.id ? '✓' : step.id}
              </div>
              <span className="hidden text-[10px] font-medium text-[#3A3A3A]/50 sm:block">
                {step.label}
              </span>
            </div>
          ))}
        </div>
        {/* Line */}
        <div className="relative h-1 w-full rounded-full bg-[#FFE9F1] mb-0">
          <motion.div
            className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-[#FFB6D6] to-[#E8B4F0]"
            animate={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="p-6 sm:p-8"
          >
            {/* Step header */}
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#FFB6D6]">
                Step {currentStep} of {STEPS.length}
              </p>
              <h2 className="text-xl font-black text-[#3A3A3A] mt-1">
                {STEPS[currentStep - 1]?.label}
              </h2>
              <p className="text-sm text-[#3A3A3A]/60 mt-0.5">
                {STEPS[currentStep - 1]?.description}
              </p>
            </div>

            {/* Step 1: About You */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <Input
                  label="Full Name"
                  required
                  placeholder="Your full name"
                  {...register('full_name')}
                  error={errors.full_name?.message}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Age"
                    type="number"
                    required
                    placeholder="Your age"
                    {...register('age', { valueAsNumber: true })}
                    error={errors.age?.message}
                  />
                  <Input
                    label="School"
                    required
                    placeholder="Your school name"
                    {...register('school')}
                    error={errors.school?.message}
                  />
                </div>
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="Optional — only used if we need to contact you"
                  hint="Optional. Only used internally if our team needs to reach you."
                  {...register('phone_number')}
                  error={errors.phone_number?.message}
                />
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-[#3A3A3A]">
                    Category <span className="text-[#FFB6D6]" aria-hidden="true">*</span>
                  </label>
                  <Select
                    value={watchCategory}
                    onValueChange={(v) => setValue('category_id', v, { shouldValidate: true })}
                  >
                    <SelectTrigger error={errors.category_id?.message}>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category_id?.message && (
                    <p className="text-xs text-red-500" role="alert">
                      {errors.category_id.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Your Story */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <Input
                  label="Story Title"
                  required
                  placeholder="Give your story a title"
                  {...register('title')}
                  error={errors.title?.message}
                />
                <Textarea
                  label="Your Story"
                  required
                  rows={10}
                  placeholder="Write your story here. Be honest, be yourself..."
                  hint="Minimum 100 characters. Maximum 10,000 characters."
                  {...register('content')}
                  error={errors.content?.message}
                  className="min-h-[240px]"
                />
              </div>
            )}

            {/* Step 3: Reflection */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="rounded-2xl bg-[#F3EDFF] p-4">
                  <p className="text-sm font-semibold text-[#3A3A3A]">Reflection Question</p>
                  <p className="text-base font-bold text-[#E8B4F0] mt-1">
                    &ldquo;What is the biggest lesson you learned from this experience?&rdquo;
                  </p>
                </div>
                <Textarea
                  label="Your Reflection"
                  required
                  rows={6}
                  placeholder="Share the lesson you learned..."
                  hint="Minimum 20 characters."
                  {...register('reflection')}
                  error={errors.reflection?.message}
                />
              </div>
            )}

            {/* Step 4: Changemaker */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="rounded-2xl bg-[#FFF3B0]/60 p-4">
                  <p className="text-sm font-semibold text-[#3A3A3A]">Confidence Changemaker</p>
                  <p className="text-base font-bold text-amber-600 mt-1">
                    &ldquo;Who is one person that made you feel more confident at school?&rdquo;
                  </p>
                </div>
                <Input
                  label="Their Name"
                  required
                  placeholder="Name of the person who inspired you"
                  {...register('changemaker_name')}
                  error={errors.changemaker_name?.message}
                />
                <Textarea
                  label="Why Did They Inspire You?"
                  required
                  rows={4}
                  placeholder="Tell us why this person made you feel more confident..."
                  {...register('changemaker_reason')}
                  error={errors.changemaker_reason?.message}
                />
              </div>
            )}

            {/* Step 5: Consent */}
            {currentStep === 5 && (
              <div className="space-y-5">
                <div className="rounded-2xl bg-[#FFE9F1] p-5">
                  <h3 className="font-bold text-[#3A3A3A] mb-3">Before you submit…</h3>
                  <p className="text-sm text-[#3A3A3A]/70 leading-relaxed">
                    Please read and agree to both statements below. Your story will be carefully
                    reviewed by our team before it is published. Your personal details will
                    never appear on the website.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Consent */}
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <Checkbox
                      id="publish_consent"
                      checked={watchConsent === true}
                      onCheckedChange={(checked) => {
                        if (checked === true) {
                          setValue('publish_consent', true, { shouldValidate: true })
                        }
                      }}
                      aria-describedby="consent-desc"
                    />
                    <div>
                      <p id="consent-desc" className="text-sm font-medium text-[#3A3A3A]">
                        I allow Beyond The Skin Project to publish my story after review.
                      </p>
                    </div>
                  </label>
                  {errors.publish_consent?.message && (
                    <p className="text-xs text-red-500 pl-8" role="alert">
                      {errors.publish_consent.message}
                    </p>
                  )}

                  {/* Privacy */}
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <Checkbox
                      id="privacy_agreement"
                      checked={watchPrivacy === true}
                      onCheckedChange={(checked) => {
                        if (checked === true) {
                          setValue('privacy_agreement', true, { shouldValidate: true })
                        }
                      }}
                      aria-describedby="privacy-desc"
                    />
                    <div>
                      <p id="privacy-desc" className="text-sm font-medium text-[#3A3A3A]">
                        My personal information will remain confidential.
                      </p>
                    </div>
                  </label>
                  {errors.privacy_agreement?.message && (
                    <p className="text-xs text-red-500 pl-8" role="alert">
                      {errors.privacy_agreement.message}
                    </p>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between border-t border-[#FFB6D6]/15 px-6 py-4 sm:px-8">
          <Button
            type="button"
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </Button>

          {currentStep < STEPS.length ? (
            <Button type="button" variant="default" onClick={handleNext} className="gap-1">
              Continue
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          ) : (
            <Button
              type="submit"
              variant="default"
              size="lg"
              disabled={isSubmitting}
              className="gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Submitting…
                </>
              ) : (
                '🌸 Submit My Story'
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
