import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

 export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
 export const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
 export const calculateAccountAge = (createdAt) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now-created);
    const diffDays = Math.ceil(diffTime/(1000*60*60*24));
    return diffDays;
  };

 /**
 * Calcuates time elapsed 
 * @param {*} dateString 
 * @returns {string}
 */
 export const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    let interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return interval + " month" + (interval === 1 ? "" : "s") + " ago";
    
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval + " day" + (interval === 1 ? "" : "s") + " ago";
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval + " hour" + (interval === 1 ? "" : "s") + " ago";
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return interval + " minute" + (interval === 1 ? "" : "s") + " ago";
    
    return Math.floor(seconds) + " second" + (Math.floor(seconds) === 1 ? "" : "s") + " ago";
  };

  /**
   * Calculate File size
   * @param {File} files - File MetaData Array
   * @returns {string} - Size of the file in KB,MB or GB 
   */
  export const calcSize=(files=[])=>{
    if(files.length===0) return `0 KB`;
    
    const storage= files.reduce((acc, curr) => acc + (curr.size || 0), 0)

    const KB = 1024;
    const MB = KB * 1024;
    const GB = MB * 1024;

    let value;
    let unit;

    if (storage >= GB) {
      value = storage / GB;

      if (value < 1) {
        value = storage / MB;
        unit = "MB";
      } else unit = "GB";
    }
    else if (storage >= MB) {
      value = storage / MB;

      if (value < 1) {
        value = storage / KB;
        unit = "KB";
      } 
      else unit = "MB";
    } 
    else {
      value = storage / KB;
      unit = "KB";
    }

    return `${value.toFixed(2)} ${unit}`;
  }