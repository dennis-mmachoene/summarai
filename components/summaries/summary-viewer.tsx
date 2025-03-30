'use client'
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

const SummaryViewer = ({summary}: {summary: string}) => {
  
  const [currentSection, setCurrentSection] = useState(0)
  const sections =  summary.split('\n# ').map((section) => section.trim()).filter(Boolean).map(parseSection)  
  return (
<Card >
  <CardHeader>
    <CardTitle>{sections[currentSection].title}</CardTitle>
  </CardHeader>
  <CardContent>
    {JSON.stringify(sections[currentSection].points)}
  </CardContent>
</Card>
  )
}

export default SummaryViewer

const parseSection = (section: string) => {
  const [title, ...content] = section.split('\n', 2);

  const cleanTitle = title.startsWith('#') ? title.substring(1).trim() : title.trim();

  const points: string[] = [];
  let currentPoint = "";

  content.forEach((line) => {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith("=")) {
      if (currentPoint) points.push(currentPoint.trim());
      currentPoint = trimmedLine;
    } else if (!trimmedLine) {
      if (currentPoint) points.push(currentPoint.trim());
      currentPoint = "";
    } else {
      currentPoint += " " + trimmedLine;
    }
  });

  if (currentPoint) points.push(currentPoint.trim());

  return {
    title: cleanTitle,
    points: points.filter(
      (point) => point && !point.startsWith("#") && !point.startsWith("|Choose")
    ),
  };
};
