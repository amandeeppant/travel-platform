/**
 * Train Route Details API
 * GET /api/trains/[trainNumber]/route
 */

import { NextRequest, NextResponse } from 'next/server';
import { trainService } from '@/lib/trainService';
import { handleTrainError } from '@/lib/trainErrors';
import { logger } from '@/lib/logger';
import { ApiResponse } from '@/types/train';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ trainNumber: string }> }
) {
  try {
    const { trainNumber } = await params;

    if (!trainNumber) {
      const response: ApiResponse<null> = {
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'Train number is required',
        },
      };
      return NextResponse.json(response, { status: 400 });
    }

    await trainService.initialize();
    const route = await trainService.getTrainRoute(trainNumber);

    const response: ApiResponse<any> = {
      success: true,
      data: route,
    };

    return NextResponse.json(response);
  } catch (error) {
    logger.error('Get train route error', { error, trainNumber: (await params).trainNumber });
    const errorInfo = handleTrainError(error);

    const response: ApiResponse<null> = {
      success: false,
      error: errorInfo,
    };

    return NextResponse.json(response, { status: errorInfo.statusCode || 400 });
  }
}
