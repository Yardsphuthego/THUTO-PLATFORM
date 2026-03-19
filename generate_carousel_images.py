#!/usr/bin/env python3
"""Generate election-themed carousel images"""

from PIL import Image, ImageDraw

def create_voting_carousel_images():
    """Create election/voting themed carousel images"""
    output_dir = "/Users/mac1/THUTO VOTING PLATFORM/frontend/src/assets/images"
    
    # Image 1: Blue Democracy Theme with checkmark
    print("Creating carousel1.jpg - Secure Voting...")
    img1 = Image.new('RGB', (1920, 1080), (0, 102, 204))
    draw1 = ImageDraw.Draw(img1)
    # Large checkmark
    draw1.ellipse([(800, 300), (1120, 620)], outline='white', width=20)
    draw1.line([(850, 450), (950, 550), (1070, 380)], fill='white', width=30)
    draw1.text((960, 800), "SECURE VOTING", fill='white', anchor="mm")
    draw1.text((960, 900), "Democracy in Motion", fill=(200, 230, 255), anchor="mm")
    img1.save(f'{output_dir}/carousel1.jpg')
    print("✅ Created carousel1.jpg")
    
    # Image 2: Light Blue Ballot Box Theme
    print("Creating carousel2.jpg - Ballot Box...")
    img2 = Image.new('RGB', (1920, 1080), (0, 136, 255))
    draw2 = ImageDraw.Draw(img2)
    # Draw ballot box
    draw2.rectangle([(700, 300), (1220, 700)], outline='white', width=25, fill=(20, 120, 200))
    draw2.rectangle([(850, 280), (1070, 320)], fill='white')  # Slot
    draw2.text((960, 800), "YOUR VOICE MATTERS", fill='white', anchor="mm")
    draw2.text((960, 900), "Cast Your Vote Today", fill=(255, 255, 255), anchor="mm")
    img2.save(f'{output_dir}/carousel2.jpg')
    print("✅ Created carousel2.jpg")
    
    # Image 3: Dark Blue Hands Together (Unity)
    print("Creating carousel3.jpg - Unity...")
    img3 = Image.new('RGB', (1920, 1080), (0, 61, 153))
    draw3 = ImageDraw.Draw(img3)
    # Draw raised hands
    for i in range(3):
        x_offset = 600 + (i * 280)
        # Hand shape (simplified)
        draw3.ellipse([(x_offset, 300), (x_offset + 160, 460)], fill=(0, 136, 255), outline='white', width=8)
        draw3.ellipse([(x_offset + 40, 200), (x_offset + 120, 330)], fill=(0, 136, 255), outline='white', width=8)
    draw3.text((960, 800), "UNITED DECISIONS", fill='white', anchor="mm")
    draw3.text((960, 900), "Every Vote Counts", fill=(100, 200, 255), anchor="mm")
    img3.save(f'{output_dir}/carousel3.jpg')
    print("✅ Created carousel3.jpg")
    
    # Image 4: Sky Blue Percentage/Results Theme
    print("Creating carousel4.jpg - Results...")
    img4 = Image.new('RGB', (1920, 1080), (51, 153, 255))
    draw4 = ImageDraw.Draw(img4)
    # Draw pie chart sections
    draw4.arc([(600, 300), (1000, 700)], 0, 180, fill='white', width=25)
    draw4.arc([(600, 300), (1000, 700)], 180, 270, fill=(0, 102, 204), width=25)
    draw4.text((1100, 400), "100%", fill='white', anchor="mm")
    draw4.text((960, 800), "TRANSPARENT RESULTS", fill='white', anchor="mm")
    draw4.text((960, 900), "Real-Time Tracking", fill=(200, 230, 255), anchor="mm")
    img4.save(f'{output_dir}/carousel4.jpg')
    print("✅ Created carousel4.jpg")
    
    print("\n" + "="*60)
    print("✅ ALL 4 CAROUSEL IMAGES CREATED SUCCESSFULLY!")
    print("="*60)
    print("\nImages saved to:")
    print(f"  {output_dir}/")
    print("\nThemes:")
    print("  1. carousel1.jpg - Secure Voting (Blue)")
    print("  2. carousel2.jpg - Ballot Box (Light Blue)")
    print("  3. carousel3.jpg - Unity/Hands (Dark Blue)")
    print("  4. carousel4.jpg - Results/Transparency (Sky Blue)")

if __name__ == "__main__":
    create_voting_carousel_images()
