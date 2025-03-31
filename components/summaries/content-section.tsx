import { parseEmojiPoint, parsePoint } from '@/utils/summary-helpers';
import React from 'react'

const EmojiPoint = ({ point, index }: { point: string; index: number; }) => {
    const { emoji, text } = parseEmojiPoint(point) ?? {}
    return (
        <div key={`point-${index}`} className="group relative bg-linear-to-br from-gray-200/[0.08] to-gray-400/[0.03] p-4 rounded-2xl border border-gray-500/10 hover:shadow-lg transition-all">

            <div className="absolute inset-0 bg-linear-to-r from-gray-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
            <div className='relative flex items-start gap-3'>
                <span className='text-lg lg:text-xl shrink-0 pt-1'>{emoji}</span>
                <p className='text-lg lg:text-xl text-muted-foreground/90 leading-relaxed'>{text}</p>
            </div>
        </div>
    )
}

const ContentSection = ({ title, points }: {
    title: string;
    points: string[];
}) => {
    return (
        <div className='space-y-4'>
            {points.map((point, index) => {
                const { isNumbered, isMainPoint, isEmpty, hasEmoji } = parsePoint(point);

                if(isEmpty) return null;
                if (hasEmoji || isMainPoint) {
                    return (
                        <EmojiPoint key={`point-${index}`} point={point} index={index} />
                    )
                }
                return( <RegularPoint key={`point-${index}`} point={point} index={index} />
                )
            })}
        </div>
    )
}

export default ContentSection

const RegularPoint = ({ index, point }: { index: number; point: string }) => {
    return (
        <div key={`point-${index}`} className="group relative bg-linear-to-br from-gray-200/[0.08] to-gray-400/[0.03] p-4 rounded-2xl border border-gray-500/10 hover:shadow-lg transition-all">

            <div className="absolute inset-0 bg-linear-to-r from-gray-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
            <p className='relative text-left text-lg lg:text-xl text-muted-foreground/90 leading-relaxed'>{point}</p>
        </div>
    )
}

