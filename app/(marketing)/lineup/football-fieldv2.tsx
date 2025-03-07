'use client'

import { useState } from 'react'
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function FootballField() {
  const [stripeWidth, setStripeWidth] = useState(20)
  const [patternType, setPatternType] = useState('horizontal')
  const [color1, setColor1] = useState('#4ade80')
  const [color2, setColor2] = useState('#22c55e')
  const [isPerspective, setIsPerspective] = useState(false)
  const [perspectiveIntensity, setPerspectiveIntensity] = useState(500)

  const getBackgroundStyle = () => {
    if (patternType === 'circular') {
      return `repeating-radial-gradient(
        circle,
        ${color1},
        ${color1} ${stripeWidth}px,
        ${color2} ${stripeWidth}px,
        ${color2} ${stripeWidth * 2}px
      )`
    } else {
      return `repeating-linear-gradient(
        ${patternType === 'horizontal' ? 'to bottom' : 'to right'},
        ${color1},
        ${color1} ${stripeWidth}px,
        ${color2} ${stripeWidth}px,
        ${color2} ${stripeWidth * 2}px
      )`
    }
  }

  const fieldStyle = {
    background: getBackgroundStyle(),
    height: '300px',
    width: '100%',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    transform: isPerspective ? `perspective(${perspectiveIntensity}px) rotateX(30deg)` : 'none',
    transition: 'transform 0.3s ease-in-out',
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-4">
      <h1 className="text-center text-2xl font-bold">Customizable Football Field Patterns</h1>
      <div style={fieldStyle}></div>
      <div className="space-y-4">
        <RadioGroup 
          value={patternType} 
          onValueChange={setPatternType}
          className="flex flex-wrap gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="horizontal" id="horizontal" />
            <Label htmlFor="horizontal">Horizontal</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="vertical" id="vertical" />
            <Label htmlFor="vertical">Vertical</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="circular" id="circular" />
            <Label htmlFor="circular">Circular</Label>
          </div>
        </RadioGroup>
        <div className="space-y-2">
          <Label htmlFor="stripe-width">Pattern Width: {stripeWidth}px</Label>
          <Slider
            id="stripe-width"
            min={5}
            max={50}
            step={1}
            value={[stripeWidth]}
            onValueChange={(value) => setStripeWidth(value[0])}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="color1">Color 1</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="color1"
                type="color"
                value={color1}
                onChange={(e) => setColor1(e.target.value)}
                className="size-12 rounded p-1"
              />
              <Input
                type="text"
                value={color1}
                onChange={(e) => setColor1(e.target.value)}
                className="grow"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="color2">Color 2</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="color2"
                type="color"
                value={color2}
                onChange={(e) => setColor2(e.target.value)}
                className="size-12 rounded p-1"
              />
              <Input
                type="text"
                value={color2}
                onChange={(e) => setColor2(e.target.value)}
                className="grow"
              />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="perspective"
              checked={isPerspective}
              onCheckedChange={setIsPerspective}
            />
            <Label htmlFor="perspective">Perspective View</Label>
          </div>
          {isPerspective && (
            <div className="space-y-2">
              <Label htmlFor="perspective-intensity">Perspective Intensity: {perspectiveIntensity}</Label>
              <Slider
                id="perspective-intensity"
                min={100}
                max={1000}
                step={10}
                value={[perspectiveIntensity]}
                onValueChange={(value) => setPerspectiveIntensity(value[0])}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

