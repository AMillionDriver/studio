
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { CommentSerializable } from '@/types/anime';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { getInitials } from '@/lib/utils';

interface CommentItemProps {
  comment: CommentSerializable;
}

export function CommentItem({ comment }: CommentItemProps) {
  const timeAgo = formatDistanceToNow(new Date(comment.createdAt), {
    addSuffix: true,
    locale: id,
  });

  return (
    <div className="flex items-start gap-4">
      <Avatar>
        <AvatarImage src={comment.authorPhotoURL || ''} alt={comment.authorName} />
        <AvatarFallback>{getInitials(comment.authorName)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-semibold">{comment.authorName}</p>
          <p className="text-xs text-muted-foreground">{timeAgo}</p>
        </div>
        <p className="text-muted-foreground whitespace-pre-wrap">{comment.text}</p>
      </div>
    </div>
  );
}
